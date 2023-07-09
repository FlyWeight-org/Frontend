import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/flights',
      name: 'flights',
      component: () => import('../views/flights/index.vue'),
      children: [
        {
          path: '',
          name: 'flightsList',
          component: () => import('../views/flights/list.vue')
        },
        {
          path: 'new',
          name: 'flightsNew',
          component: () => import('../views/flights/new.vue')
        },
        {
          path: ':flightID',
          name: 'flight',
          component: () => import('../views/flight/index.vue'),
          children: [
            {
              path: '',
              name: 'flightsShow',
              component: () => import('../views/flight/show.vue')
            },
            {
              path: 'loads/:loadName',
              name: 'flightsFinished',
              component: () => import('../views/flight/finished.vue')
            }
          ]
        }
      ]
    },

    {
      path: '/account',
      name: 'account',
      component: () => import('../views/account/index.vue'),
      children: [
        {
          path: '',
          name: 'accountEdit',
          component: () => import('../views/account/edit.vue')
        }
      ]
    },

    {
      path: '',
      name: 'home',
      component: () => import('../views/home/index.vue'),
      children: [
        {
          path: 'login',
          name: 'logIn',
          component: () => import('../views/home/logIn.vue'),
          alias: ''
        },
        {
          path: 'signup',
          name: 'signUp',
          component: () => import('../views/home/signUp.vue')
        },
        {
          path: 'forgot-password',
          name: 'forgotPassword',
          component: () => import('../views/home/forgotPassword.vue')
        },
        {
          path: 'reset-password',
          name: 'resetPassword',
          component: () => import('../views/home/resetPassword.vue')
        }
      ]
    }
  ]
})

export default router
