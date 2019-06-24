import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   name: 'home',
    //   path: '/',
    //   component: () => import('@/views/home/')
    // },
    { // layout 显示到根组件的路由出口
      // name: 'layout', // 使用javasc 命名路由导航不会渲染默认子路由
      path: '/',
      component: () => import('@/views/layout'),
      children: [
        { // 所有children 路由全部显示在父路由 router-view 中
          name: 'home',
          path: '', // 父路由的默认内容
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login/')
    }
  ]
})
