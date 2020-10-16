import { createRouter, createWebHistory } from 'vue-router'

const routerHistory = createWebHistory()

const router = createRouter({
  history: routerHistory,
  routes: [
    { path: '/', name: 'Home', component: () => import('../components/Home.vue') },
    { path: '/test', name: 'Test', component: () => import('../components/Test.vue') },
    { path: '/login', name: 'Login', component: () => import('../components/Login.vue') },
    { path: '/manageEmployees', name: 'Manage Employees', component: () => import('../components/ManageEmployees.vue') },
    { path: '/chat', name: 'Chat', component: () => import('../components/Chat.vue') },
    { path: '/search', name: 'Search', component: () => import('../components/Search.vue') },
    { path: '/logout', redirect: '/' }
  ]
})

export default router