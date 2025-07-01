import Vue from 'vue';
import Router from 'vue-router';
import AdminLayout from '../layout/AdminLayout.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/login/Login.vue')
    },
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('../views/home/Home.vue')
        },
        {
          path: 'banner',
          name: 'Banner',
          component: () => import('../views/banner/Banner.vue')
        },
        {
          path: 'category',
          name: 'Category',
          component: () => import('../views/category/Category.vue')
        },
        {
          path: 'goods',
          name: 'Goods',
          component: () => import('../views/goods/Goods.vue')
        },
        {
          path: 'order',
          name: 'Order',
          component: () => import('@/views/order/Order.vue'),
          meta: { title: '订单管理', icon: 'el-icon-s-order' }
        },
        {
          path: 'stats/sales',
          name: 'StatsSales',
          component: () => import('@/views/stats/Sales.vue'),
          meta: { title: '销售统计' }
        },
        {
          path: 'stats/orders',
          name: 'StatsOrders',
          component: () => import('@/views/stats/Orders.vue'),
          meta: { title: '订单统计' }
        },
        {
          path: 'stats/hot-goods',
          name: 'StatsHotGoods',
          component: () => import('@/views/stats/HotGoods.vue'),
          meta: { title: '热销商品' }
        },
        {
          path: 'stats/conversion',
          name: 'StatsConversion',
          component: () => import('../views/stats/Conversion.vue')
        },
        {
          path: 'stats/trend',
          name: 'StatsTrend',
          component: () => import('@/views/stats/Trend.vue'),
          meta: { title: '销售趋势' }
        },
        {
          path: 'system',
          name: 'System',
          component: () => import('../views/system/System.vue')
        },
        {
          path: '',
          redirect: 'home'
        }
      ]
    },
    {
      path: '/',
      redirect: '/admin'
    }
  ]
}); 