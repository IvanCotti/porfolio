<template>
  <div class="analyzer-console">
    <div class="console-header">
      <span class="dot red"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
      <span class="title">Terminal</span>
    </div>
    <div class="console-body" ref="consoleBody">
      <div v-for="(line, index) in displayedLines" :key="index" class="console-line">
        <span class="prompt">> </span>
        <span v-html="line"></span>
      </div>
      <div class="console-line active-line">
        <span class="prompt">> </span>
        <span class="cursor">_</span>
      </div>
    </div>
  </div>

  <v-expand-transition>
    <v-card v-if="vtResults" class="country-container">
      <div class="d-flex align-center ga-3 text-h5">
        <img :src="flagUrl(vtResults.country_code)" :alt="vtResults.country_code" width="36" height="27" />
        <span>{{ vtResults.location_trace }}</span>
      </div>
      <v-divider class="my-2" />
      <div class="d-flex align-center ga-3">
        <span>{{ vtResults.as_owner }}</span>
        <span>{{ vtResults.regional_internet_registry }}</span>
      </div>
    </v-card>
  </v-expand-transition>

  <v-expand-transition>
    <div v-if="showMap" class="analyzer-map-container">
      <div class="text-end w-100"> <span class="text-green">●</span> Online</div>
      <div id="map" class="map-view"></div>
    </div>
    <div v-else class="map-placeholder">
      <div class="text-end w-100"> <span class="text-red">●</span> Offline</div>
    </div>
  </v-expand-transition>

</template>

<script>
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default {
  name: "SecurityAnalyzer",
  props: {},
  emits: ['finished'],

  data() {
    return {
      ipAddress: null,
      vtResults: null,
      loading: false,
      error: null,
      apiKey: import.meta.env.VITE_VIRUSTOTAL_API_KEY,
      outputBuffer: [],
      displayedLines: [],
      isTyping: false,
      typingSpeed: 30,
      lineDelay: 300,
      latitude: null,
      longitude: null,
      showMap: false,
      map: null,
    };
  },

  async mounted() {
    const cached = localStorage.getItem('vtResults')
    if (cached) {
      this.vtResults = JSON.parse(cached)

      if (!this.vtResults.location_coords || this.vtResults.location_coords.length != 2) {
        localStorage.removeItem('vtResults')
        this.vtResults = null
        this.queueMessage("Updating system protocols...", "system")
        await this.analyzeIP()
      } else {
        this.queueAnalysisOutput()
      }
    } else {
      this.queueMessage("Initializing secure connection...", "system")
      await this.analyzeIP()
    }
  },

  methods: {

    flagUrl(code) {
      if (!code) return 'https://flagcdn.com/w40/unknown.png';
      return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
    },

    async analyzeIP() {
      this.loading = true;
      this.queueMessage("Fetching IP address...", "system")

      try {
        const ipResponse = await fetch('https://ipapi.co/json/');
        if (!ipResponse.ok) throw new Error('Failed to fetch IP data');
        const ipData = await ipResponse.json();

        this.queueMessage(`Target Identified: ${ipData.ip}`, "success")
        if (ipData.country_name) {
          this.queueMessage(`Location Trace: ${ipData.city}, ${ipData.country_name}`, "warning")
        }

        const headers = { 'x-apikey': this.apiKey }

        const [reportRes, resolutionsRes] = await Promise.all([
          fetch(`https://www.virustotal.com/api/v3/ip_addresses/${ipData.ip}`, { headers }),
          fetch(`https://www.virustotal.com/api/v3/ip_addresses/${ipData.ip}/resolutions?limit=10`, { headers })
        ])

        if (!reportRes.ok) throw new Error('Error querying VirusTotal Report');

        const reportData = await reportRes.json();
        console.log(reportData)
        const attrs = reportData.data.attributes || {};

        const maliciousResults = {};
        if (attrs.last_analysis_results) {
          Object.entries(attrs.last_analysis_results).forEach(([engine, result]) => {
            if (result.category !== 'undetected') {
              maliciousResults[engine] = result;
            }
          });
        }

        let processedResolutions = [];
        if (resolutionsRes.ok) {
          const resolutionsData = await resolutionsRes.json();
          if (resolutionsData.data && resolutionsData.data.length > 0) {
            processedResolutions = resolutionsData.data.map(item => ({
              id: item.id || null,
              ip_address_last_analysis_stats: item.attributes?.ip_address_last_analysis_stats || null,
              resolver: item.attributes?.resolver || null,
              host_name: item.attributes?.host_name || null
            }));
          }
        }

        this.vtResults = {
          created_at: new Date().toISOString(),
          ip_address: ipData.ip,
          as_owner: attrs.as_owner || null,
          network: attrs.network || null,
          regional_internet_registry: attrs.regional_internet_registry || null,
          country_code: attrs.country ? attrs.country : 'Unknown',
          location_coords: [ipData.longitude, ipData.latitude],
          location_trace: `${ipData.city}, ${ipData.country_name}`,
          malicious_results: Object.keys(maliciousResults).length > 0 ? maliciousResults : "Engines: Malware Undetected",
          resolutions: processedResolutions.length > 0 ? processedResolutions : "Not Found"
        };

        localStorage.setItem('vtResults', JSON.stringify(this.vtResults))

        this.queueAnalysisOutput()

      } catch (err) {
        this.queueMessage(`ERROR: ${err.message}`, "error")
        console.error(err)
      } finally {
        this.loading = false;
      }
    },

    queueAnalysisOutput() {
      this.queueMessage("Analysis IP Address: ● ONLINE", "success")
      this.queueMessage("Receiving initial data from host...", "header")
      if (this.vtResults) {
        Object.entries(this.vtResults).forEach(([key, value]) => {
          if (!value) {
            this.queueMessage(`${key}: Not Found`, "system")
          } else {
            if (key == 'location_coords' && value.length == 2) {
              this.queueMessage(`Ubication Found: ${value}`, "success")
              this.queueMessage(`Opening geolocation map`, "warning")
              this.initMap(value[1], value[0])
            } else {
              this.queueMessage(`${key}: ${value}`, "system")
            }
          }

        })

      }

      this.queueMessage("[EYESPY] Starting intrusive data collection algorithms ", "success")
      this.processQueue();
    },

    initMap(lat, lon) {
      if (this.map) return;

      this.showMap = true;

      this.$nextTick(() => {
        this.map = new maplibregl.Map({
          container: 'map',
          style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
          center: [lon, lat],
          zoom: 2,
          attributionControl: false
        });

        this.map.on('load', () => {
          this.map.flyTo({
            center: [lon, lat],
            zoom: 12,
            speed: 2
          });

          const el = document.createElement('div');
          el.className = 'map-marker';

          new maplibregl.Marker({
            element: el,
            anchor: 'center'
          })
            .setLngLat([lon, lat])
            .addTo(this.map)
        });
      });
    },

    formatObjectInline(obj) {
      if (!obj) return 'null'
      return Object.entries(obj)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ')
    },

    queueMessage(text, type = "info") {
      let formattedText = text
      if (type === 'error') formattedText = `<span class="text-red">${text}</span>`
      if (type === 'success') formattedText = `<span class="text-green">${text}</span>`
      if (type === 'warning') formattedText = `<span class="text-yellow">${text}</span>`
      if (type === 'header') formattedText = `<span class="text-cyan font-weight-bold">${text}</span>`
      if (type === 'system') formattedText = `<span class="text-grey">${text}</span>`

      this.outputBuffer.push(formattedText)

      if (!this.isTyping && this.outputBuffer.length === 1) {
        this.processQueue()
      }
    },

    async processQueue() {
      if (this.isTyping) return
      this.isTyping = true

      while (this.outputBuffer.length > 0) {
        const content = this.outputBuffer.shift()
        await this.typeLine(content)
        await new Promise(r => setTimeout(r, this.lineDelay))
      }
      this.isTyping = false
    },

    async typeLine(htmlContent) {
      const hasTags = /<[a-z][\s\S]*>/i.test(htmlContent)

      if (hasTags) {
        this.displayedLines.push(htmlContent)
      } else {
        let currentLine = ""
        this.displayedLines.push("")
        const index = this.displayedLines.length - 1

        for (let i = 0; i < htmlContent.length; i++) {
          currentLine += htmlContent[i]
          this.displayedLines[index] = currentLine
          this.scrollToBottom()
          await new Promise(r => setTimeout(r, this.typingSpeed))
        }
        return
      }

      this.scrollToBottom()
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.consoleBody;
        if (container) container.scrollTop = container.scrollHeight;
      });
    }
  }
};
</script>

<style scoped>
.analyzer-console {
  width: 500px;
  box-shadow: 0 0 20px rgba(var(--v-theme-primary), 0.1);
  background-color: #0c0c0c;
  border: 1px solid #333;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  transition: all 0.5s ease;
  position: absolute;
  top: calc(var(--header-height) + 1em);
  left: 1em;
}


.analyzer-map-container {
  width: 500px;
  height: 400px;
  box-shadow: 0 0 20px rgba(var(--v-theme-primary), 0.1);
  background: #0c0c0c;
  border: 1px solid #333;
  overflow: hidden;
  transition: all 1s ease;
  padding: 8px;
  position: absolute;
  bottom: 1em;
  right: 1em;
}

.country-container {
  position: absolute;
  top: calc(var(--header-height) + 2em);
  right: 2em;
  background-color: #0c0c0c;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 0 20px rgba(var(--v-theme-primary), 0.1);
}

.map-view {
  width: 100%;
  height: 100%;
  border: 1px solid #333;
}

.map-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: absolute;
}

:deep(.map-marker) {
  width: 50px;
  height: 50px;
  border: 1px solid rgb(var(--v-theme-primary));
  background-color: #0c0c0c90;
  position: relative;
}

:deep(.map-marker::after) {
  content: '◆';
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  text-shadow: 0 0 5px rgba(var(--v-theme-tertiary), 0.5);
  color: rgb(var(--v-theme-primary));
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  animation: ripple 2s infinite;
}


.console-header {
  background-color: #1a1a1a;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #333;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.dot.red {
  background-color: #ff5f56;
}

.dot.yellow {
  background-color: #ffbd2e;
}

.dot.green {
  background-color: #27c93f;
}

.title {
  margin-left: auto;
  color: #666;
  font-size: 12px;
  letter-spacing: 1px;
}

.console-body {
  padding: 16px;
  height: 400px;
  overflow-y: auto;
  color: #ffffff54;
  font-size: 16px;
  line-height: 1.5;
}

.console-body::-webkit-scrollbar {
  width: 8px;
}

.console-body::-webkit-scrollbar-track {
  background: #0c0c0c;
}

.console-body::-webkit-scrollbar-thumb {
  background: #4141418e;
  border-radius: 4px;
}

.console-line {
  word-wrap: break-word;
}

.prompt {
  margin-right: 8px;
}

.cursor {
  animation: blink 1s step-end infinite;
}

@keyframes blink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

/* Utility classes for coloring created in JS */
:deep(.text-red) {
  color: #ff5555;
}

:deep(.text-green) {
  color: #55ff55;
}

:deep(.text-yellow) {
  color: #ffff55;
}

:deep(.text-cyan) {
  color: #55ffff;
}

:deep(.text-grey) {
  color: #888888;
}

:deep(.font-weight-bold) {
  font-weight: bold;
}
</style>
```