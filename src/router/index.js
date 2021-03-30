import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Vacation from '../views/Employee/Vacation.vue'
import User from '../views/Admin/User.vue'

const routes = [
  {
    path: '/Home',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/employee/vacation',
    name: 'Vacation',
    component: Vacation
  },
  {
    path: '/admin/user',
    name: 'user',
    component: User
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
