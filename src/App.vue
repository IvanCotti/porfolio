<template>
  <v-app :theme="store.theme">
    <v-app-bar flat border="b" class="px-md-4" :color="store.theme === 'dark' ? 'black' : 'white'">
      <v-app-bar-title class="font-weight-bold text-uppercase tracking-widest">
        IVÁN ALEJANDRO COTTI
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-menu location="bottom end">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="text" prepend-icon="mdi-web">
            {{ store.language === 'es' ? 'Español' : 'English' }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="store.setLanguage('es')" value="es">
            <v-list-item-title>Español</v-list-item-title>
          </v-list-item>
          <v-list-item @click="store.setLanguage('en')" value="en">
            <v-list-item-title>English</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn icon @click="store.toggleTheme" class="ml-2">
        <v-icon>{{ store.theme === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>

      <v-btn icon @click="showAnalyzer = true" class="ml-2">
        <v-icon>mdi-console</v-icon>
        <v-tooltip activator="parent" location="bottom">Open Console</v-tooltip>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>

    <!-- Security Analyzer Overlay -->
    <v-overlay v-model="showAnalyzer" class="align-center justify-center security-overlay" persistent
      :scrim="store.theme === 'dark' ? 'black' : 'white'" z-index="9000">
      <SecurityAnalyzer @finished="onAnalyzerFinished" />
    </v-overlay>

    <!-- Global Loader -->
    <v-overlay :model-value="store.isLoading" class="align-center justify-center" persistent z-index="9999">
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import { useAppStore } from './stores/appStore';
import SecurityAnalyzer from './components/SecurityAnalyzer.vue';

export default {
  name: "App",
  props: {},
  components: {
    SecurityAnalyzer
  },
  data() {
    return {
      showAnalyzer: !sessionStorage.getItem('analyzerSeen')
    };
  },
  computed: {
    store() {
      return useAppStore();
    }
  },
  methods: {
    onAnalyzerFinished() {
      sessionStorage.setItem('analyzerSeen', 'true');
      setTimeout(() => {
        this.showAnalyzer = false;
      }, 1500); // 1.5s delay after completion to read final message
    }
  }
};
</script>

<style>
/* Global professional overrides */
:root {
  --header-height: 64px;
  --color-primary: #f6da91;
  --color-secondary: #4f6862;
  --color-tertiary: #dc422a;
  --color-background: #0f191b;
}

@font-face {
  font-family: 'PrimaryFont';
  src: url('./assets/fonts/Conduit.otf');
}

html,
body {
  font-family: 'PrimaryFont', sans-serif;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.custom-drawer {
  border-left: 1px solid #333 !important;
}

.v-application {
  background-color: rgb(var(--v-theme-surface));
  background-image:
    radial-gradient(circle at 100% 100%, #1a1a1a 0, #1a1a1a 8px, transparent 8px),
    radial-gradient(circle at 0 0, #1a1a1a 0, #1a1a1a 8px, transparent 8px) !important;
  background-size: 40px 40px;
  background-attachment: fixed;
}

.v-theme--light .v-application {
  background-image:
    radial-gradient(circle at 100% 100%, #e0e0e0 0, #e0e0e0 8px, transparent 8px),
    radial-gradient(circle at 0 0, #e0e0e0 0, #e0e0e0 8px, transparent 8px) !important;
}

.security-overlay .v-overlay__content {
  width: 90%;
  max-width: 800px;
}

.v-application,
.v-application .v-theme--dark,
.v-application .v-theme--light,
.v-main,
.v-app-bar {
  transition: background-color 0.3s ease, color 0.3s ease !important;
}
</style>