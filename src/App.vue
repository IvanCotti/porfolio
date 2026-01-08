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

      <v-divider vertical class="mx-4 my-auto h-50"></v-divider>

      <v-btn icon @click="store.toggleAnalyzer" color="default" :active="store.isAnalyzerOpen">
        <v-icon>mdi-shield-check-outline</v-icon>
        <v-tooltip activator="parent" location="bottom">System Monitor</v-tooltip>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>

    <v-navigation-drawer v-model="store.isAnalyzerOpen" location="right" width="400" temporary
      class="bg-grey-darken-4 custom-drawer">
      <div class="d-flex flex-column h-100 pa-4">
        <div class="d-flex align-center justify-space-between mb-4">
          <div class="d-flex align-center">
            <v-icon color="green" icon="mdi-console" class="mr-2"></v-icon>
            <span class="text-subtitle-1 font-weight-bold text-green terminal-font">SEC_MONITOR_V2</span>
          </div>
          <v-btn icon="mdi-close" size="small" variant="text" color="grey" @click="store.toggleAnalyzer"></v-btn>
        </div>

        <v-divider class="mb-4 border-green-op"></v-divider>

        <div class="flex-grow-1 overflow-hidden" style="position: relative;">
          <SecurityAnalyzer />
        </div>
      </div>
    </v-navigation-drawer>
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
    return {};
  },
  computed: {
    store() {
      return useAppStore();
    }
  },
  methods: {}
};
</script>

<style>
/* Global professional overrides */
:root {
  --header-height: 64px;
  --color-primary: #2196f3;
  --color-secondary: #ff9800;
}

@font-face {
  font-family: 'PrimaryFont';
  src: url('./assets/fonts/Conduit.otf');
}

html,
body {
  font-family: 'PrimaryFont', sans-serif;
}


/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Drawer Specifics */
.custom-drawer {
  border-left: 1px solid #333 !important;
}

/* Utility to keep terminal font just for the analyzer label if needed */
.terminal-font {
  font-family: 'Courier New', Courier, monospace !important;
}

.border-green-op {
  border-color: rgba(0, 255, 0, 0.2) !important;
}
</style>