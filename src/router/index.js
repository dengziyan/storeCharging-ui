import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/branch',
        name: 'branch',
        component: () => import('@/views/branchMag/branch/index'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/bigScreen',
        name: 'bigScreen',
        component: () => import('@/views/bigScreen/index'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/payItems',
        name: 'payItems',
        component: () => import('@/views/financialMag/payItems/index'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/payBills',
        name: 'payBills',
        component: () => import('@/views/financialMag/payBills/index'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/payDetail',
        name: 'payDetail',
        component: () => import('@/views/financialMag/payDetail/index'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/incomeStatic',
        name: 'incomeStatic',
        component: () => import('@/views/financialMag/incomeStatic/index'),
        meta: {
          keepAlive: false // 需要缓存的页面
        }
      },
      {
        path: '/incomeDetail',
        name: 'incomeDetail',
        component: () => import('@/views/financialMag/incomeDetail/index'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/refundDetail',
        name: 'refundDetail',
        component: () => import('@/views/financialMag/refundDetail/index'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/countResult',
        name: 'countResult',
        component: () => import('@/views/financialMag/countResult/index'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/countDetail',
        name: 'countDetail',
        component: () => import('@/views/financialMag/countDetail/index'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/incomeSituation',
        name: 'incomeSituation',
        component: () => import('@/views/financialMag/incomeSituation/index'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/overview',
        name: 'overview',
        component: () => import('@/views/financialMag/overview/index'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/userList',
        name: 'userList',
        component: () => import('@/views/Authoraty/UserList'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/roleList',
        name: 'roleList',
        component: () => import('@/views/Authoraty/RoleList'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/menuList',
        name: 'menuList',
        component: () => import('@/views/Authoraty/MenuList'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/resourceList',
        name: 'resourceList',
        component: () => import('@/views/Authoraty/ResourceList'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/allocResource',
        name: 'allocResource',
        component: () => import('@/views/Authoraty/allocResource'),
        meta: {
          keepAlive: false // 需要缓存的页面
        }
      },
      {
        path: '/resourceCategory',
        name: 'resourceCategory',
        component: () => import('@/views/Authoraty/resourceCategory'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/sqlDict',
        name: 'sqlDict',
        component: () => import('@/views/System/sqlDict'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/opeDiary',
        name: 'opeDiary',
        component: () => import('@/views/System/Diary/OpeDiary'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/logDiary',
        name: 'logDiary',
        component: () => import('@/views/System/Diary/LogDiary'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/online',
        name: 'online',
        component: () => import('@/views/System/Online'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: '/personal',
        name: 'personal',
        component: () => import('@/views/personal/index'),
        meta: {
          keepAlive: false // 需要缓存的页面
        }
      }
    ]
  },
  {
    path: '/forgetPwd',
    name: 'forgetPwd',
    component: () => import('@/views/personal/forgetPwd'),
    meta: {
      keepAlive: false // 需要缓存的页面
    }
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  mode: 'history', // 这一句删掉路由的#号
  routes: constantRoutes
})

const router = createRouter() // 为的就是在后面用到

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
