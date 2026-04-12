import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layouts/default/index.vue'

// 公共路由（无需登录）
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: 'login.title',
      hidden: true
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '404',
      hidden: true
    }
  }
]

// 需要权限的路由
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: {
      title: 'nav.dashboard',
      icon: 'HomeFilled'
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: 'nav.dashboard',
          icon: 'Monitor'
        }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          title: 'nav.profile',
          icon: 'User',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    meta: {
      title: 'nav.system',
      icon: 'Setting'
    },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          title: 'nav.user',
          icon: 'User'
        }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          title: 'nav.role',
          icon: 'UserFilled'
        }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: {
          title: 'nav.menu',
          icon: 'Menu'
        }
      }
    ]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    meta: {
      title: 'nav.example',
      icon: 'Document'
    },
    children: [
      {
        path: 'table',
        name: 'TableExample',
        component: () => import('@/views/example/table/index.vue'),
        meta: {
          title: 'nav.table',
          icon: 'Grid'
        }
      },
      {
        path: 'form',
        name: 'FormExample',
        component: () => import('@/views/example/form/index.vue'),
        meta: {
          title: 'nav.form',
          icon: 'EditPen'
        }
      }
    ]
  },
  // 刷新重定向
  {
    path: '/redirect/:path(.*)',
    component: () => import('@/layouts/default/index.vue'),
    beforeEnter: (to) => {
      const path = '/' + (to.params.path as string[]).join('/')
      return path
    },
    meta: { hidden: true }
  },
  // 404 必须放在最后
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: {
      hidden: true
    }
  }
]
