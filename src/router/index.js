import Vue from 'vue'
import VueRouter from 'vue-router'
import ListArticle from '@/views/ListArticle'
import CreateArticle from '@/views/CreateArticle'
import Register from '@/views/Register'
import Index from '@/views/Index'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/articles/index'
  },

  {
    path: '/articles/index',
    name: 'Index',
    component: Index,
    children: [
      {
        path: '/',
        name: 'ListArticle',
        component: ListArticle,
      },
      {
        path: "/articles/create",
        name: 'CreateArticle',
        component: CreateArticle,
      },
    ]
  },

  {
    path: "/auth",
    name: 'Register',
    component: Register,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
