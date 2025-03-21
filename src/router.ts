import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue')
    },
    {
        path: '/bingo/:id',
        name: 'Bingo',
        component: () => import('@/views/Bingo.vue')
    },
]

// Create the router instance
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router