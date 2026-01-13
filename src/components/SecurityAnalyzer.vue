<template>
  <div class="analyzer-container">
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
    <div class="analyzer-map-container" :class="{ visible: showMap }">
      <div id="map" class="map-view"></div>
      <div v-if="!showMap" class="map-placeholder">
        <span class="text-grey">Map System Offline...</span>
      </div>
    </div>
  </div>
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

  computed: {},
  async mounted() {
    const cached = localStorage.getItem('vtResults')
    if (cached) {
      this.vtResults = JSON.parse(cached)
      this.ipAddress = localStorage.getItem('ipAddress') || 'UNKNOWN'
      this.latitude = localStorage.getItem('latitude')
      this.longitude = localStorage.getItem('longitude')

      if (!this.latitude || !this.longitude) {
        // Legacy cache without location data, clear and re-fetch
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
    async analyzeIP() {
      this.loading = true;
      this.queueMessage("Fetching IP address...", "system")

      try {
        const ipResponse = await fetch('https://ipapi.co/json/');
        if (!ipResponse.ok) throw new Error('Failed to fetch IP data');
        const ipData = await ipResponse.json();

        this.ipAddress = ipData.ip;
        this.latitude = ipData.latitude;
        this.longitude = ipData.longitude;

        localStorage.setItem('ipAddress', this.ipAddress)
        localStorage.setItem('latitude', this.latitude)
        localStorage.setItem('longitude', this.longitude)
        this.queueMessage(`Target Identified: ${this.ipAddress}`, "success")
        if (ipData.country_name) {
          this.queueMessage(`Location Trace: ${ipData.city}, ${ipData.country_name}`, "warning")
        }

        this.queueMessage("Querying VirusTotal Database...", "system")

        const headers = { 'x-apikey': this.apiKey }

        const [reportRes, resolutionsRes] = await Promise.all([
          fetch(`https://www.virustotal.com/api/v3/ip_addresses/${this.ipAddress}`, { headers }),
          fetch(`https://www.virustotal.com/api/v3/ip_addresses/${this.ipAddress}/resolutions?limit=10`, { headers })
        ])

        if (!reportRes.ok) throw new Error('Error querying VirusTotal Report');

        const reportData = await reportRes.json();
        const attrs = reportData.data.attributes || {};

        // Filter malicious results (exclude undetected)
        const maliciousResults = {};
        if (attrs.last_analysis_results) {
          Object.entries(attrs.last_analysis_results).forEach(([engine, result]) => {
            if (result.category !== 'undetected') {
              maliciousResults[engine] = result;
            }
          });
        }

        // Process Resolutions
        let processedResolutions = null;
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

        // Construct Final Object
        this.vtResults = {
          as_owner: attrs.as_owner || null,
          network: attrs.network || null,
          regional_internet_registry: attrs.regional_internet_registry || null,
          continent: attrs.continent || null,
          country: attrs.country || null,
          malicious_results: Object.keys(maliciousResults).length > 0 ? maliciousResults : null,
          resolutions: processedResolutions
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
      this.queueMessage("--- ANALYSIS REPORT ---", "header")

      if (this.vtResults) {
        for (const [key, value] of Object.entries(this.vtResults)) {
          if (key === 'malicious_results') {
            if (value) {
              this.queueMessage("--- DETECTED THREATS ---", "header")
              Object.entries(value).forEach(([engine, result]) => {
                const status = result.category === 'malicious' ? 'error' : 'warning';
                this.queueMessage(`[${engine}]: ${result.result} (${result.category})`, status)
              });
            } else {
              this.queueMessage("No malicious results detected.", "success")
            }
          } else if (key === 'resolutions') {
            if (value) {
              this.queueMessage("--- RESOLUTIONS ---", "header")
              value.forEach((res, index) => {
                this.queueMessage(`[Resolution #${index + 1}]`, "header")
                Object.entries(res).forEach(([rKey, rVal]) => {
                  if (rVal && typeof rVal === 'object') {
                    this.queueMessage(`   ${rKey}: ${this.formatObjectInline(rVal)}`)
                  } else {
                    this.queueMessage(`   ${rKey}: ${rVal || 'null'}`)
                  }
                })
              })
            } else {
              this.queueMessage("Resolutions: null", "system")
            }
          } else {
          }
        }

        // Trigger Map if location is available
        if (this.vtResults && this.vtResults.country) {
          // We can trigger it here or after specific lines.
          // Let's trigger it after a short delay or when the report is somewhat populated
        }
      }

      this.queueMessage("--- END OF REPORT ---", "system")
      this.processQueue();
    },

    initMap() {
      if (!this.latitude || !this.longitude) return;
      if (this.map) return;

      this.showMap = true;

      this.$nextTick(() => {
        this.map = new maplibregl.Map({
          container: 'map',
          style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json', // Dark theme
          center: [this.longitude, this.latitude],
          zoom: 2, // Start zoomed out
          attributionControl: false
        });

        this.map.on('load', () => {
          // Fly to location
          this.map.flyTo({
            center: [this.longitude, this.latitude],
            zoom: 5,
            speed: 1.2
          });

          const el = document.createElement('div');
          el.className = 'map-marker';

          new maplibregl.Marker(el)
            .setLngLat([this.longitude, this.latitude])
            .addTo(this.map);
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

      // Check for triggers to open map
      if (text.toLowerCase().includes('country') || text.toLowerCase().includes('location trace')) {
        // Queue the map open action? No, better to do it cleanly.
        // We'll set a flag to open it after this line is typed?
        // Actually, let's just trigger it immediately but the 'visible' class handles the fade in.
        // Better: Add a special "command" to the queue or check in typeLine.
        // Simplest: Check in analyzeIP or just call initMap() but it needs to happen in sync with typing?
        // The user said "Cuando se muestre el pais y continente... se abra un mapa".
        // So it should happen when that line is displayed.
      }

      if (!this.isTyping && this.outputBuffer.length === 1) { // Start if not already running
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
      // this.$emit('finished')
    },

    async typeLine(htmlContent) {
      // Check if this line contains Country/Continent info to trigger map
      if (htmlContent.includes('country') || htmlContent.includes('Location Trace')) {
        this.initMap();
      }

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
        return // Done typing this line
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
  background-color: #0c0c0c;
  border: 1px solid #333;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.1);
  width: 100%;
  flex: 1;
  /* Take available space */
  display: flex;
  flex-direction: column;
  transition: all 0.5s ease;
}

.analyzer-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1200px;
  /* Increased max-width */
  margin: 20px auto;
  gap: 20px;
  height: 400px;
}

.analyzer-map-container {
  flex: 0;
  /* Hidden initially */
  width: 0;
  opacity: 0;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  transition: all 1s ease;
  background: #0c0c0c;
}

.analyzer-map-container.visible {
  flex: 1;
  width: auto;
  opacity: 1;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.1);
}

.map-view {
  width: 100%;
  height: 100%;
}

.map-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* Marker Style */
:deep(.map-marker) {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(255, 0, 0, 0.5);
  border: 2px solid #ff0000;
  box-shadow: 0 0 10px #ff0000;
  animation: pulse 2s infinite;
  cursor: pointer;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.5);
    opacity: 0.7;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
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
  background: #004400;
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