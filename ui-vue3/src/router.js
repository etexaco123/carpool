import { createRouter, createWebHistory } from 'vue-router'

const routerHistory = createWebHistory()

const router = createRouter({
  history: routerHistory,
  routes: [
    { path: '/', component: () => import('./components/Home.vue') },
    { path: '/test', component: () => import('./components/Test.vue') },
    { path: '/register', component: () => import('./components/Register.vue') },
    { path: '/login', component: () => import('./components/Login.vue') }
  ]
})

export default router