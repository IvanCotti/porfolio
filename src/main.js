import { createApp } from 'vue'
import App from './App.vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import router from './plugins/router'
import pinia from './plugins/pinia'

import '@mdi/font/css/materialdesignicons.css'

// const myCustomDark = {
//   dark: true,
//   colors: {
//     background: '#0f191b',
//     surface: '#0f191b',
//     primary: '#f6da91',
//     secondary: '#4f6862',
//     tertiary: '#dc422a',
//   }
// }

// const myCustomLight = {
//   dark: false,
//   colors: {
//     background: '#FFFFFF',
//     surface: '#F5F5F5',
//     primary: '#0d4955ff',
//     secondary: '#4f6862',
//     tertiary: '#dc422a',
//   }
// }

// const vuetify = createVuetify({
//   components,
//   directives,
//   theme: {
//     defaultTheme: 'myCustomDark',
//     themes: {
//       myCustomDark,
//       myCustomLight,
//       light: myCustomLight,
//       dark: myCustomDark,
//     }
//   },
//   icons: {
//     defaultSet: 'mdi',
//   },
// })

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
  },
  icons: {
    defaultSet: 'mdi',
  },
})

createApp(App)
  .use(vuetify)
  .use(pinia)
  .use(router)
  .mount('#app')