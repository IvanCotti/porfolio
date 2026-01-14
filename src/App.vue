<template>
  <v-app :theme="store.theme">
    <v-app-bar flat border="b" class="px-md-4" :color="store.theme === 'dark' ? 'dark' : 'light'">
      <v-app-bar-title class="font-weight-bold text-uppercase tracking-widest">
        <img src="/order.svg" alt="Logo" width="100">
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

    </v-app-bar>

    <main>
      <router-view></router-view>
    </main>

    <v-overlay :model-value="store.isLoading" class="align-center justify-center" persistent z-index="9999">
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import { useAppStore } from './stores/appStore';

export default {
  name: "App",
  data() {
    return {
    };
  },
  computed: {
    store() {
      return useAppStore();
    }
  },
};
</script>

<style>
:root {
  --header-height: 64px;
}

@font-face {
  font-family: 'PrimaryFont';
  src: url('./assets/fonts/Conduit.otf');
}

html,
body {
  font-family: 'PrimaryFont', sans-serif;
  font-size: 18px;
}

.bg-dark {
  background: #00000038 !important;
  backdrop-filter: blur(5px);
}

.bg-light {
  background: #75757559 !important;
  backdrop-filter: blur(5px);
}

header {
  width: 100vw !important;
  box-shadow: 0px 0px 10px rgb(var(--v-theme-secondary)) !important;
}

/* Overrides Vuetify */
.v-application {
  /* background:
    radial-gradient(circle at 20% 30%, #76f65c26 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, #48ec9a26 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, #06b6d41a 0%, transparent 50%) ! important; */
  background-color: var(--v-theme-surface);
  background-size: 40px 40px;
  background-attachment: fixed;
}

.text-h1,
.text-h2,
.text-h3,
.text-h4,
.text-h5,
.text-h6,
.text-body-1,
.text-body-2,
.text-subtitle-1,
.text-subtitle-2 {
  font-family: 'PrimaryFont', sans-serif !important;
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

/* Mobile Responsive Styles */
@media (max-width: 600px) {
  .v-app-bar-title {
    font-size: 0.75rem !important;
    letter-spacing: 0.05em !important;
  }

  .v-app-bar .v-btn {
    min-width: 40px !important;
  }

  .v-app-bar .v-btn--icon {
    width: 40px !important;
    height: 40px !important;
  }
}

/* Animations */
@keyframes ripple {
  from {
    box-shadow: 0 0 0 0 rgb(var(--v-theme-tertiary));
  }

  to {
    box-shadow: 0 0 0 22px #63d2ff00;
  }
}
</style>