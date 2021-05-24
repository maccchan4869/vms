import { createRouter, createWebHashHistory } from 'vue-router'
import Store from '../store'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Vacation from '../views/Employee/Vacation.vue'
import Expenses from '../views/Employee/Expenses.vue'
import User from '../views/Admin/User.vue'
import AdminVacation from '../views/Admin/Vacation.vue'
import AdminExpenses from '../views/Admin/Expenses.vue'

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
    component: Vacation,
    beforeEnter: (to, from, next) => {
      sendLogin(next);
    }
  },
  {
    path: '/employee/expenses',
    name: 'Expenses',
    component: Expenses,
    beforeEnter: (to, from, next) => {
      sendLogin(next);
    }
  },
  {
    path: '/admin/user',
    name: 'user',
    component: User,
    beforeEnter: (to, from, next) => {
      sendLogin(next);
    }
  },
  {
    path: '/admin/vacation',
    name: 'AdminVacation',
    component: AdminVacation,
    beforeEnter: (to, from, next) => {
      sendLogin(next);
    }
  },
  {
    path: '/admin/expenses',
    name: 'AdminExpenses',
    component: AdminExpenses,
    beforeEnter: (to, from, next) => {
      sendLogin(next);
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const sendLogin = (next) => {
  const loginUser = Store.getters.getLoginUser;
  if(!loginUser.uid) {
    next({path: '/'});
  } else {
    next();
  }
}

export default router
