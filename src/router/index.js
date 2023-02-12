import Vue from 'vue'
import Router from 'vue-router'
Vue.use( Router )
import Layout from '@/layout/Layout/index'

export const constantRoutes = [
  {
    path : '/redirect/:path(.*)',
    component : () => import( '@/views/redirect/index' )
  },
  {
    path : '/',
    name : 'Base',
    component : Layout,
    redirect : '/home',
    hidden : true,
    meta : {
      title : 'HOME',
      icon : 'device1',
      roles : ['admin', 'user']
    },
    children : [
      {
        path : 'home',
        component : () => import( '@/views/home/index' ),
        name : 'Home',
        meta : {
          noCache : true,
          title : 'HOME',
          roles : ['admin', 'user']
        }
      }
    ]
  },

  {
    path : '/auth-redirect',
    component : () => import( '@/views/login/auth-redirect' ),
    hidden : true
  },
  {
    path : '/404',
    component : () => import( '@/views/error-page/404' ),
    hidden : true,
    meta : {
      title : '404'
    }
  },
  {
    path : '/401',
    component : () => import( '@/views/error-page/401' ),
    hidden : true,
    meta : {
      title : '401'
    }
  }
]
/**
 * asyncRoutes
 * 需要根据用户角色动态加载的路由
 *   [ 'admin' ]
 */
export const asyncRoutes = [
  { path : '*', redirect : '/404', hidden : true }
]
const createRouter = () => new Router( {
  mode : 'hash', // require service support
  scrollBehavior : () => {
    history.pushState( null, null, document.URL )
    return ( { y : 0 } )
  },
  routes : constantRoutes
} )

const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}
export default router
