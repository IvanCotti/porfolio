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
</template>

<script>
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
    };
  },

  computed: {},
  async mounted() {
    const cached = localStorage.getItem('vtResults')
    if (cached) {
      this.vtResults = JSON.parse(cached)
      this.ipAddress = localStorage.getItem('ipAddress') || 'UNKNOWN'
      this.queueAnalysisOutput()
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
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        this.ipAddress = ipData.ip;
        localStorage.setItem('ipAddress', this.ipAddress)
        this.queueMessage(`Target Identified: ${this.ipAddress}`, "success")

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
            // Primitive values
            if (value && typeof value === 'object') {
              this.queueMessage(`${key}: ${this.formatObjectInline(value)}`)
            } else {
              const displayValue = value === null ? 'null' : value;
              this.queueMessage(`${key}: ${displayValue}`)
            }
          }
        }
      }

      this.queueMessage("--- END OF REPORT ---", "system")
      this.processQueue();
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
      this.$emit('finished')
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
  max-width: 800px;
  margin: 20px auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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