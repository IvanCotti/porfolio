import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAppStore } from './appStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/test', name: 'test', component: () => import('../views/TestView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

router.beforeEach((to, from, next) => {
  const store = useAppStore()
  store.setLoading(true)
  next()
})

router.afterEach(() => {
  const store = useAppStore()
  setTimeout(() => {
    store.setLoading(false)
  }, 500)
})

export default router
