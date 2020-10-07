import { createRouter, createWebHistory } from 'vue-router'

const routerHistory = createWebHistory()

const router = createRouter({
  history: routerHistory,
  routes: [
    { path: '/', name: 'Home', component: () => import('../components/Home.vue') },
    { path: '/test', name: 'Test', component: () => import('../components/Test.vue') },
    { path: '/register', name: 'Register', component: () => import('../components/Register.vue') },
    { path: '/login', name: 'Login', component: () => import('../components/Login.vue') },
    { path: '/logout', name: 'Logout', component: () => import('../components/Logout.vue') }
  ]
})

export default router