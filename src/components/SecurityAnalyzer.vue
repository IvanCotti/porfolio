<template>
  <div class="analyzer-console">
    <div class="console-header">
      <span class="dot red"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
      <span class="title">SECURE_TERMINAL_V1.0</span>
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

  data() {
    return {
      ipAddress: null,
      vtResults: null,
      loading: false,
      error: null,
      apiKey: '5169c26f0824b80e1872298007b8d5d657cb13789ff38b579ea02029ce836c87',
      outputBuffer: [],     // All lines waiting to be printed
      displayedLines: [],   // Lines currently on screen
      isTyping: false,
      typingSpeed: 30,       // ms per char (faster than before for better UX)
      lineDelay: 300,        // ms between lines
    };
  },

  computed: {
    relatedDomains() {
      const cert = this.vtResults?.last_https_certificate?.extensions?.subject_alternative_name || []
      return cert.filter(domain =>
        domain.includes('.gov') ||
        domain.includes('.mil') ||
        domain.includes('.edu') ||
        domain.includes('.org') ||
        domain.includes('.ar')
      )
    },
  },
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
        // Analizar con VirusTotal
        const vtResponse = await fetch(
          `https://www.virustotal.com/api/v3/ip_addresses/${this.ipAddress}`,
          {
            headers: {
              'x-apikey': this.apiKey
            }
          }
        );

        if (!vtResponse.ok) {
          throw new Error('Error al consultar VirusTotal');
        }

        const vtData = await vtResponse.json();
        this.vtResults = vtData.data.attributes;
        localStorage.setItem('vtResults', JSON.stringify(this.vtResults))

        this.queueAnalysisOutput()

      } catch (err) {
        this.queueMessage(`ERROR: ${err.message}`, "error")
      } finally {
        this.loading = false;
      }
    },

    queueAnalysisOutput() {
      this.queueMessage("--- ANALYSIS REPORT ---", "header")

      if (this.vtResults) {
        this.queueMessage(`Location: [${this.vtResults.country}, ${this.vtResults.continent}]`)
        this.queueMessage(`Network: ${this.vtResults.network}`)
        this.queueMessage(`AS Owner: ${this.vtResults.as_owner}`)

        if (this.vtResults.last_https_certificate?.subject?.O) {
          this.queueMessage(`Cert Organization: ${this.vtResults.last_https_certificate.subject.O}`)
        }

        if (this.relatedDomains.length > 0) {
          this.queueMessage("--- RELATED DOMAINS ---", "header")
          this.relatedDomains.forEach(d => this.queueMessage(`  - ${d}`))
        }

        this.queueMessage("--- THREAT INTELLIGENCE ---", "header")
        const stats = this.vtResults.last_analysis_stats
        if (stats) {
          this.queueMessage(`Malicious: ${stats.malicious}`, stats.malicious > 0 ? "error" : "success")
          this.queueMessage(`Suspicious: ${stats.suspicious}`, stats.suspicious > 0 ? "warning" : "success")
          this.queueMessage(`Harmless: ${stats.harmless}`, "success")
        }
      }

      this.queueMessage("--- END OF REPORT ---", "system")
      this.processQueue();
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
    },

    async typeLine(htmlContent) {
      // Simple logic: we push the line fully but maybe we could animate characters if it was plain text.
      // Since we have HTML spans, animating char by char is tricky without breaking tags.
      // We will simulate "typing" by adding the line and scrolling.
      // For a more advanced effect, we could strip tags, animate text, then replace with HTML, 
      // but line-by-line reveal is also "console-like".

      // Let's try a hybrid: if it has no tags, type it. If it has tags, dump it.
      const hasTags = /<[a-z][\s\S]*>/i.test(htmlContent)

      if (hasTags) {
        this.displayedLines.push(htmlContent)
      } else {
        // Simulate typing for plain text logic could go here, 
        // but for consistency with the "HTML colored" lines, line-by-line is often cleaner and faster to read.
        // However, user ASKED for "tipado de a poco".
        // Let's implement a simple char-by-char for the *last* line if we want, 
        // BUT doing it on specific array items is reactive.

        // Simplified approach: appear line by line is "typing" of the screen.
        // If we want char by char:
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
/* Font setup handled in App.vue generally, but we enforce it here */
.analyzer-console {
  background-color: #0c0c0c;
  border: 1px solid #333;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.1);
  font-family: 'COD', 'Courier New', monospace;
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
  /* Fixed height for scroll */
  overflow-y: auto;
  color: #00ff00;
  /* Classic hacker green */
  font-size: 16px;
  line-height: 1.5;
}

/* Scrollbar styling */
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
  margin-bottom: 4px;
  word-wrap: break-word;
}

.prompt {
  color: #00aa00;
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