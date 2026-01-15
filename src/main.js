import { createApp } from 'vue'
import App from './App.vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import router from './plugins/router'
import pinia from './plugins/pinia'

import '@mdi/font/css/materialdesignicons.css'

const myCustomDark = {
  dark: true,
  colors: {
    background: '#0f191b',
    surface: '#111414ff',
    primary: '#f6da91',
    secondary: '#4f6862',
    tertiary: '#dc422a',
  }
}

const redTheme = {
  dark: true,
  colors: {
    background: '#111925ff',
    surface: '#1a2433ff',
    primary: '#F63049',
    secondary: '#D02752',
    tertiary: '#8A244B',
  },
}

const lightTheme = {
  dark: false,
  colors: {
    background: '#e2dbbe',
    surface: '#F5F5F5',
    primary: '#D02752',
    secondary: '#4f6862',
    tertiary: '#dc422a',
  }
}

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'redTheme',
    themes: {
      redTheme,
      lightTheme,
      light: lightTheme,
      dark: redTheme,
    }
  },
  icons: {
    defaultSet: 'mdi',
  },
})

// const vuetify = createVuetify({
//   components,
//   directives,
//   theme: {
//     defaultTheme: 'dark',
//   },
//   icons: {
//     defaultSet: 'mdi',
//   },
// })

createApp(App)
  .use(vuetify)
  .use(pinia)
  .use(router)
  .mount('#app')