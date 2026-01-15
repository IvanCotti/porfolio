<template>
  <div class="git-contributions">
    <div class="months">
      <p>Jan</p>
      <p>Feb</p>
      <p>Mar</p>
      <p>Apr</p>
      <p>May</p>
      <p>Jun</p>
      <p>Jul</p>
      <p>Aug</p>
      <p>Sep</p>
      <p>Oct</p>
      <p>Nov</p>
      <p>Dec</p>
    </div>
    <div class="contribute-calendar">
      <div class="weeks">
        <p>Mon</p>
        <p>Wed</p>
        <p>Fri</p>
      </div>
      <div>
        <div ref="ledContainer" class="led-container"></div>
        <div class="bottom-scale">
          <p>Less</p>
          <div class="color-box legend-1"></div>
          <div class="color-box legend-2"></div>
          <div class="color-box legend-3"></div>
          <div class="color-box legend-4"></div>
          <div class="color-box legend-5"></div>
          <p>More</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ledFont } from './ledFont';

export default {
  name: 'GitContributions',
  props: {
    text: {
      type: String,
      default: 'IvanCotti - GitHub'
    },
    scrollSpeed: {
      type: Number,
      default: 100
    },
    rows: {
      type: Number,
      default: 7
    },
    cols: {
      type: Number,
      default: 50
    }
  },
  data() {
    return {
      ledMatrix: [],
      animationId: null,
      classNames: ['on-1', 'on-2', 'on-3', 'on-4']
    };
  },
  mounted() {
    this.createLEDMatrix();
    this.startScrolling();
  },
  beforeUnmount() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  },

  watch: {
    text() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      this.startScrolling();
    }
  },

  methods: {
    createLEDMatrix() {
      const container = this.$refs.ledContainer;
      this.ledMatrix = [];

      for (let i = 0; i < this.rows; i++) {
        const row = document.createElement('div');
        row.className = 'led-row';
        this.ledMatrix[i] = [];

        for (let j = 0; j < this.cols; j++) {
          const led = document.createElement('div');
          led.className = 'led';
          row.appendChild(led);
          this.ledMatrix[i][j] = led;
        }

        container.appendChild(row);
      }
    },

    getTextMatrix(text) {
      let matrix = Array(this.rows)
        .fill()
        .map(() => []);

      for (let char of text.toUpperCase()) {
        if (ledFont[char]) {
          for (let i = 0; i < this.rows; i++) {
            matrix[i] = matrix[i].concat(ledFont[char][i]);
            matrix[i].push(0); // Espacio entre caracteres
          }
        }
      }

      return matrix;
    },

    startScrolling() {
      const textMatrix = this.getTextMatrix(this.text + '   ');
      let startCol = -this.cols;
      let lastUpdate = performance.now();

      const updateDisplay = () => {
        const now = performance.now();

        if (now - lastUpdate >= this.scrollSpeed) {
          lastUpdate = now;

          for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
              const textCol = (startCol + j) % textMatrix[0].length;

              if (textCol >= 0) {
                const isOn = textMatrix[i][textCol] === 1;
                const randomClass = this.classNames[
                  Math.floor(Math.random() * this.classNames.length)
                ];

                this.ledMatrix[i][j].classList.remove('on-1', 'on-2', 'on-3', 'on-4');

                if (isOn) {
                  this.ledMatrix[i][j].classList.add(randomClass);
                }
              } else {
                this.ledMatrix[i][j].classList.remove('on-1', 'on-2', 'on-3', 'on-4');
              }
            }
          }

          startCol++;

          if (startCol > textMatrix[0].length) {
            startCol = -this.cols;
          }
        }

        this.animationId = requestAnimationFrame(updateDisplay);
      };

      updateDisplay();
    }
  }
};
</script>

<style>
.git-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.git-contributions {
  width: 535px;
  height: fit-content;
  padding: 20px 10px;
  border: solid 2px #3d444d;
  font-size: 12px;
  font-family: system-ui;
  padding-bottom: 5px;
  background: rgb(var(--v-theme-surface));
  color: white;
  transition: all 0.3s ease-in-out;
}

.git-contributions:hover {
  border: solid 2px #a3ffbb;
  box-shadow: 0px 0px 20px rgb(var(--v-theme-success));
  cursor: pointer;
}

.contribute-calendar {
  display: flex;
}

.weeks {
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 6px;
  margin-right: 4px;
}

.weeks p {
  margin: 0;
}

.months {
  display: flex;
  width: 90%;
  height: 22px;
  gap: 20px;
  margin-left: 38px;
}

.bottom-scale {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 4px;
  padding: 4px;
}

.bottom-scale p {
  margin: 0;
  color: #9198a1;
}

.color-box {
  height: 10px;
  width: 10px;
  border-radius: 2px;
}

.legend-1 {
  background-color: #171c21;
}

.legend-2 {
  background-color: #1f432b;
}

.legend-3 {
  background-color: #2e6b38;
}

.legend-4 {
  background-color: #52a44f;
}

.legend-5 {
  background-color: #6cd064;
}

#led-container {
  padding: 10px;
}

.led-row {
  display: flex;
}

.led {
  width: 6px;
  height: 6px;
  margin: 1.8px;
  border-radius: 20%;
  background-color: #171c21;
}

.led.on-1 {
  background-color: #1f432b;
}

.led.on-2 {
  background-color: #2e6b38;
}

.led.on-3 {
  background-color: #52a44f;
}

.led.on-4 {
  background-color: #6cd064;
}
</style>