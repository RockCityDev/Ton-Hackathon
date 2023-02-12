import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getCookieByKey } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'
NProgress.configure( { showSpinner : false } )
import { TOKEN } from '@/api/constant'
const whiteList = [
  '/redirect', '/home'
]

router.beforeEach( async( to, from, next ) => {
  NProgress.start()
  document.title = getPageTitle( to.meta.title )
  const hasToken = getCookieByKey( TOKEN )
  if ( hasToken ) {
    if ( to.path === '/login' ) {
      next( { path : '/home' } )
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if ( hasRoles ) {
        next()
      } else {
        try {
          // const tokenData = {}
          const res = await store.dispatch( 'user/getUserInfo' )
          const roles = ['admin']
          const accessRoutes = await store.dispatch( 'permission/generateRoutes', roles )
          router.addRoutes( accessRoutes )
          next( { ...to, replace : true } )
        } catch ( error ) {
          await store.dispatch( 'user/resetInfo' )
          // next( `/login?redirect=${to.path}` )
          next( `/home` )
          NProgress.done()
        }
      }
    }
  } else {
    if ( whiteList.indexOf( to.path ) !== -1 || to.path.startsWith( '/redirect' ) ) {
      next()
    } else {
      // next( `/home?redirect=${to.path}` )
      next( `/home` )
      NProgress.done()
    }
  }
} )

router.afterEach( () => {
  NProgress.done()
} )

