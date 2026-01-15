<template>
  <div v-if="showConsole" class="analyzer-console draggable" ref="console" @mousedown="startDrag($event, 'console')"
    :style="positions.console">
    <div class="console-header drag-handle">
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

  <div v-if="showUni" class="uni-container draggable" ref="uniContainer" @mousedown="startDrag($event, 'uniContainer')"
    :style="positions.uniContainer">
    <div class="header d-flex align-center ga-3 drag-handle">
      <div class="d-flex flex-column pa-3">
        <div class="d-flex align-center ga-1">
          <span class="text-h4">UNSAM</span>
          <v-icon icon="mdi-chevron-right" size="tiny" />
          <span class="text-emphasis-medium">{{ education.institution }}</span>
        </div>
        <span class="text-body-2 text-amber-darken-2">San Martín, Buenos Aires</span>
      </div>
    </div>
    <img src="@/assets/images/unsam-logo.png" alt="uni" class="logo" />
    <div class="gradient"></div>
    <img src="@/assets/images/campus.webp" alt="campus" class="campus" />
  </div>

  <div v-if="showMap" class="analyzer-map-container draggable" ref="mapContainer"
    @mousedown="startDrag($event, 'mapContainer')" :style="positions.mapContainer">
    <div class="d-flex justify-space-between text-white w-100 px-2 py-1 drag-handle">
      <div class="d-flex align-center ga-2">
        <img src="https://flagcdn.com/w40/ar.png" alt="ar" width="32" height="24" />
        <span>San Martín, Buenos Aires</span>
        <!-- <span>-34.57 -58.52</span> -->
      </div>
      <div><span class="text-green">●</span> Online</div>
    </div>
    <div id="map" class="map-view"></div>
  </div>

</template>

<script>
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default {
  name: "DisplayInfo",
  props: {
    info: {
      type: Object,
      default: null
    },
    education: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      showConsole: false,
      showMap: false,
      showUni: false,
      map: null,
      positions: {
        console: {},
        uniContainer: {},
        mapContainer: {}
      },
      dragging: {
        active: false,
        element: null,
        startX: 0,
        startY: 0,
        initialX: 0,
        initialY: 0
      },

      outputBuffer: [],
      displayedLines: [],
      isTyping: false,
      typingSpeed: 20,
      lineDelay: 500,
    }
  },

  async mounted() {
    setTimeout(() => {
      this.showConsole = true;
      this.queueMessage("Initializing portfolio data...", "system")
      document.addEventListener('mousemove', this.onDrag);
      document.addEventListener('mouseup', this.stopDrag);

      this.displayPortfolioData()
    }, 1000)
  },

  beforeUnmount() {
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.stopDrag);
  },

  methods: {

    startDrag(event, elementKey) {
      // Solo permitir arrastrar si se hace click en el header/drag-handle
      if (!event.target.closest('.drag-handle')) {
        return;
      }

      const element = this.$refs[elementKey];
      if (!element) return;

      // Prevenir selección de texto
      event.preventDefault();

      // Obtener posición actual del elemento
      const rect = element.getBoundingClientRect();

      this.dragging = {
        active: true,
        element: elementKey,
        startX: event.clientX,
        startY: event.clientY,
        initialX: rect.left,
        initialY: rect.top
      };

      // Agregar clase visual
      element.classList.add('dragging');
    },

    onDrag(event) {
      if (!this.dragging.active) return;

      event.preventDefault();

      // Calcular nueva posición
      const deltaX = event.clientX - this.dragging.startX;
      const deltaY = event.clientY - this.dragging.startY;

      const newX = this.dragging.initialX + deltaX;
      const newY = this.dragging.initialY + deltaY;

      // Obtener dimensiones de la ventana y del elemento
      const element = this.$refs[this.dragging.element];
      const rect = element.getBoundingClientRect();
      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;

      // Limitar posición dentro de la ventana
      const constrainedX = Math.max(0, Math.min(newX, maxX));
      const constrainedY = Math.max(0, Math.min(newY, maxY));

      // Actualizar posición
      this.positions[this.dragging.element] = {
        position: 'fixed',
        left: `${constrainedX}px`,
        top: `${constrainedY}px`,
        right: 'auto',
        bottom: 'auto'
      };
    },

    stopDrag() {
      if (this.dragging.active) {
        const element = this.$refs[this.dragging.element];
        if (element) {
          element.classList.remove('dragging');
        }
      }

      this.dragging = {
        active: false,
        element: null,
        startX: 0,
        startY: 0,
        initialX: 0,
        initialY: 0
      };
    },

    displayPortfolioData() {
      this.queueMessage("Loading portfolio information...", "header")

      if (this.info && Object.keys(this.info).length > 0) {
        this.queueMessage("\n=== PERSONAL INFO ===", "success")

        Object.entries(this.info).forEach(([key, value]) => {
          if (value && typeof value === 'object') {
            if (key.toLowerCase() === 'linkedin' || key.toLowerCase() === 'github') {
              this.queueMessageWithLink(key, value.username, value.url);
            } else {
              this.queueMessageKeyValue(key, value)
            }
          } else if (value) {
            this.queueMessageKeyValue(key, value)
          }
        })
      }

      if (this.education) {
        this.queueMessage("\n=== EDUCATION ===", "success")
        this.queueMessageKeyValue("Institution", this.education.institution)
        this.queueMessageKeyValue("Degree", this.education.degree)
        this.queueMessageKeyValue("Period", this.education.period)
        this.queueMessageKeyValue("Status", this.education.status)
        this.queueMessage("Opening geolocation map...", "warning")
        setTimeout(() => {
          this.initMap(-34.57849628176265, -58.526781327105084)
          setTimeout(() => {
            this.showUni = true;
          }, 2000)
        }, 2000)
      }

      this.queueMessage("\n[SYSTEM] Portfolio data loaded successfully", "success")
      this.processQueue()
    },


    queueMessageKeyValue(key, value) {
      const formattedKey = `<span class="text-cyan">${key}:</span>`
      const formattedValue = `<span class="text-white">${value}</span>`
      this.queueMessage(`  ${formattedKey} ${formattedValue}`, "raw")
    },

    queueMessageWithLink(key, username, url) {
      const formattedKey = `<span class="text-cyan">${key}:</span>`
      const link = `<a href="${url}" target="_blank" rel="noopener noreferrer">${username}</a>`
      this.queueMessage(`  ${formattedKey} ${link}`, "raw")
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
            zoom: 15,
            speed: 1.5
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

    queueMessage(text, type = "info") {
      let formattedText = text
      if (type === 'raw') {
        formattedText = text
      } else if (type === 'error') formattedText = `<span class="text-red">${text}</span>`
      else if (type === 'warning') formattedText = `<span class="text-yellow">${text}</span>`
      else if (type === 'header') formattedText = `<span class="text-cyan font-weight-bold">${text}</span>`
      else if (type === 'system') formattedText = `<span class="text-grey">${text}</span>`
      else if (type === 'success') {
        this.outputBuffer.push("<span></span>")
        formattedText = `<span class="text-green">${text}</span>`
      }

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
  },
}
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
  height: var(--map-height);
  box-shadow: 0 0 20px rgba(var(--v-theme-primary), 0.1);
  background: #0c0c0c;
  border: 1px solid #333;
  overflow: hidden;
  transition: all 1s ease;
  position: absolute;
  bottom: 1em;
  right: 1em;
  animation: slideInFromRight 0.8s ease-out;
}

.uni-container {
  position: absolute;
  bottom: calc(var(--map-height) + 2em);
  right: 1em;
  background-color: #0c0c0c;
  border: 1px solid #333;
  padding: 8px;
  color: #fff;
  box-shadow: 0 0 20px rgba(var(--v-theme-primary), 0.1);
}

.uni-container .header {
  position: absolute;
  width: 100%;
  z-index: 1;
}

.uni-container .campus {
  max-width: 25vw;
  height: fit-content;
}

.uni-container .logo {
  width: 100px;
  position: absolute;
  bottom: 1em;
  right: 1em;
  z-index: 1;
  animation: slideFromCenter 0.8s ease-out;
}

@keyframes slideFromCenter {
  from {
    opacity: 0;
    transform: translate(-100%, -100%);
  }

  to {
    opacity: 1;
    transform: translate(0, 0);
  }
}

.analyzer-console,
.analyzer-map-container,
.uni-container {
  animation: deploy 0.3s ease-out;
}

@keyframes deploy {
  from {
    opacity: 0;
    transform: scale(0.1);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.gradient {
  position: absolute;
  width: calc(100% - 8px);
  height: calc(100% - 8px);
  background: radial-gradient(circle at 50% 50%, transparent, #000000c9);
}

.map-view {
  width: 100%;
  height: 100%;
  border: 1px solid #333;
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
  opacity: 0;
  animation: fadeInLine 0.3s ease-in forwards;
}

@keyframes fadeInLine {
  from {
    opacity: 0;
    transform: translateX(-5px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
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

.draggable {
  z-index: 10;
}

.draggable.dragging {
  cursor: grabbing;
  z-index: 1000;
  box-shadow: 0 10px 40px rgba(var(--v-theme-primary), 0.3);
  transition: none;
}

.drag-handle {
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
}

.draggable * {
  user-select: none;
}

.console-body {
  cursor: default !important;
  user-select: text;
}
</style>
```