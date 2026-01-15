<template>
  <section class="hero d-flex flex-column align-center justify-center fade-section">
    <CursorAnimated />
    <v-avatar size="128" class="mb-4">
      <v-icon icon="mdi-account-circle" size="128" color="primary"></v-icon>
    </v-avatar>
    <h1 ref="mainTitle" class="text-h3 font-weight-bold text-primary mb-2">
      IVÁN ALEJANDRO COTTI
    </h1>
    <h2 class="text-h4 text-medium-emphasis">
      {{ t.title }}
    </h2>
    <DisplayInfo :info="info" :education="t.education" />
  </section>

  <v-divider></v-divider>

  <section class="py-16 fade-section">
    <GitContributions class="ma-auto mb-8" />
  </section>

  <section class="mb-16 fade-section">
    <h3 class="text-h4 font-weight-bold mb-8 text-primary">{{ t.sections.experience }}</h3>

    <v-timeline side="end" align="start" density="comfortable" line-color="tertiary">

      <v-timeline-item dot-color="primary" size="small" v-for="(job, index) in t.experience" :key="index">
        <v-card variant="flat" class="bg-transparent">
          <v-card-title class="text-h6 font-weight-bold px-0 pt-0 text-wrap">{{ job.role }}</v-card-title>
          <v-card-subtitle class="px-0 text-subtitle-1 text-high-emphasis opacity-100 mb-1">
            {{ job.company }}
          </v-card-subtitle>
          <v-card-text class="px-0 pb-0">
            <div class="text-caption text-medium-emphasis mb-3 font-weight-medium text-uppercase tracking-wider">
              {{ job.period }}
            </div>
            <ul class="ml-5 pl-4 text-body-1 text-medium-emphasis custom-list">
              <li v-for="(task, i) in job.tasks" :key="i" class="mb-2">{{ task }}</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-timeline-item>

    </v-timeline>
  </section>

  <section class="skills mb-16 fade-section">
    <h3 class="text-h4 font-weight-bold mb-8 text-primary">{{ t.sections.skills }}</h3>

    <div v-for="(category, key) in skills" :key="key" class="skill">
      <h4 class="text-h5 text-high-emphasis mb-4">
        <v-icon icon="mdi-chevron-right" class="mr-2"></v-icon>{{ t.skillCategories[key] }}
      </h4>
      <div class="d-flex justify-center flex-wrap ga-3">
        <v-card v-for="skill in category" :key="skill.name" :href="skill.url" target="_blank" rel="noopener noreferrer"
          class="d-flex flex-column align-center justify-center py-4 h-100 transition-swing cursor-pointer">
          <v-img :src="skill.logo" :alt="skill.name" width="48" height="48" class="mb-3" contain></v-img>
          <div class="text-center">{{ skill.name }}</div>
        </v-card>
      </div>
    </div>
  </section>
</template>

<script>
import { useAppStore } from '../plugins/appStore';
import data from '../data/data';
import DisplayInfo from '../components/DisplayInfo.vue';
import GitContributions from '../components/GitContributions.vue';
import CursorAnimated from '../components/CursorAnimated.vue';

export default {
  name: "HomeView",
  props: {},
  components: {
    DisplayInfo,
    GitContributions,
    CursorAnimated
  },
  data() {
    return data
  },

  computed: {
    store() {
      return useAppStore();
    },
    t() {
      return this.translations[this.store.language];
    }
  },

  mounted() {
    if (this.$refs.mainTitle) {
      this.matrixEffect(this.$refs.mainTitle, 'IVÁN ALEJANDRO COTTI');
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    const sections = document.querySelectorAll('.fade-section');
    sections.forEach(section => {
      observer.observe(section);
    });
  },

  methods: {
    matrixEffect(element, finalText) {
      const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
      const chars = finalText.split('');
      element.innerHTML = chars.map(char => `<span class="char">${char}</span>`).join('');

      const charElements = element.querySelectorAll('.char');

      charElements.forEach((char, index) => {
        const iterations = 5 + Math.random() * 10;
        let counter = 0;

        const interval = setInterval(() => {
          if (counter < iterations) {
            char.textContent = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            counter++;
          } else {
            char.textContent = chars[index];
            clearInterval(interval);
          }
        }, 30 + index * 10);
        char.style.animationDelay = `${index * 0.03}s`;
      });
    }
  }
}
</script>

<style>
.hero {
  height: 100vh;
  border-bottom: 1px solid var(--v-theme-primary);
  background-size: 25px 25px;
  background-image: radial-gradient(rgba(var(--v-theme-primary), 0.2) 1px, transparent 3px);
  background-repeat: repeat;
}

main section:not(.hero) {
  width: 50%;
  margin: auto;
}

/* Mobile Responsive Styles */

@media (max-width: 600px) {
  main section:not(.hero) {
    width: 100%;
    margin: 0;
  }

  .hero {
    height: fit-content;
    padding-top: calc(var(--header-height) + 1em);
  }

  .hero h1 {
    font-size: 1.75rem !important;
    line-height: 1.2;
  }

  .hero h2 {
    font-size: 1.1rem !important;
    text-align: center;
  }

  .hero .v-avatar {
    width: 96px !important;
    height: 96px !important;
  }

  .hero .v-avatar .v-icon {
    font-size: 96px !important;
  }

  .skills .v-card {
    width: 100%;
  }

  .v-timeline {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1em 0.5em;
  }

  .v-timeline-item__body {
    padding: 0 !important;
    max-width: 100%;
  }

  .v-timeline-divider {
    display: none;
  }

  h3 {
    text-align: center;
  }
}

/* Overrides Vuetify */

.v-timeline {
  background: rgb(var(--v-theme-surface));
  border-radius: 1em;
}

.v-timeline-divider__dot,
.v-timeline-item__body {
  transition: all 0.3s ease;
}

.v-timeline-item .v-timeline-divider__dot {
  height: unset !important;
  width: unset !important;
}

.v-timeline-item:hover .v-timeline-divider__dot {
  transform: scale(1.5);
  animation: ripple 1.6s 0.4s ease-out infinite;
}

.v-timeline-divider__inner-dot {
  height: unset !important;
  width: unset !important;
}

.v-timeline-item:hover .v-timeline-item__body {
  transform: translateX(1em);
}

.custom-list {
  list-style-type: square;
}

.custom-list li::marker {
  color: rgb(var(--v-theme-primary));
}

.tracking-wider {
  letter-spacing: 0.1em;
}

.skills .skill {
  margin-bottom: 2rem;
  width: fit-content;
}

.skills .v-card {
  transition: all 0.3s ease;
  border: 5px solid transparent;
  width: 120px;
  max-height: 120px;
  line-height: 1;
}

.skills .v-card .v-img {
  transition: all 0.3s ease;
}

.skills .v-card:hover .v-img {
  transform: scale(1.4);
}

.skills .v-card:hover {
  border-image: radial-gradient(transparent 90%, rgb(var(--v-theme-primary)) 10%) 1;
  background: radial-gradient(rgba(var(--v-theme-primary), 0.5), rgba(var(--v-theme-surface), 0.5));
  color: rgb(var(--v-theme-primary));
}

.fade-section {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  will-change: opacity, transform;
}

.fade-section.visible {
  opacity: 1;
  transform: translateY(0);
}

/* H1 ANIMATION */

.char {
  display: inline-block;
  opacity: 0;
  width: 1ch;
  font-family: "PrimaryFont";
  text-align: center;
  animation: matrixReveal 0.3s ease-in forwards;
}


@keyframes matrixReveal {
  0% {
    opacity: 0;
    color: #ffffff;
    text-shadow: 0 0 20px #ffffff;
    transform: scale(1.2);
  }

  50% {
    opacity: 1;
    color: #ffffff;
    text-shadow: 0 0 15px #ffffff;
  }

  100% {
    opacity: 1;
    color: var(--bs-primary);
    text-shadow: 0 0 10px var(--bs-primary);
    transform: scale(1);
  }
}
</style>
