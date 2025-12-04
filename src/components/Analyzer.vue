<template>
  <section class="ma-auto w-50">
    <code class="console">
      <!-- <DataTable v-if="vtResults" :data="vtResults.last_analysis_results"/> -->
      {{ vtResults || 1 }}
    </code>
  </section>  
</template>

<script>
import DataTable from './DataTable.vue';

export default {
  name: 'Analyzer',
  data() {
    return {
      ipAddress: null,
      vtResults: null,
      loading: false,
      error: null,
      isTyping: true,
      apiKey: '5169c26f0824b80e1872298007b8d5d657cb13789ff38b579ea02029ce836c87'
    };
  },
  components: {
    DataTable
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
    }
  },

  async mounted() {

    const cached = localStorage.getItem('vtResults')
    if (cached) {
      this.vtResults = JSON.parse(cached)
      return
    }
    await this.analyzeIP()
  },

  methods: {
    async analyzeIP() {
      this.loading = true;
      this.error = null;
      this.vtResults = null;

      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        this.ipAddress = ipData.ip;

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
      } catch (err) {
        this.error = err.message || 'Error al realizar el análisis';
      } finally {
        this.loading = false;
      }
    },
    formatDate(timestamp) {
      if (!timestamp) return 'N/A';
      return new Date(timestamp * 1000).toLocaleString('es-AR');
    }
  }
};
</script>

<style scoped>
.console span {
  display: block;
  max-width: fit-content;
  font-family: "COD", sans-serif;
  font-size: 20px;
  overflow: hidden;
  border-right: 3px solid #00ff00;
  white-space: nowrap;
  animation: typing 4s steps(70) forwards, blink 1s infinite;
}

@keyframes typing {
  from {
    width: 0;
  }

  to {
    width: 100%;
  }
}

@keyframes blink {

  0%,
  50% {
    border-color: #ffffff;
  }

  51%,
  100% {
    border-color: transparent;
  }
}
</style>