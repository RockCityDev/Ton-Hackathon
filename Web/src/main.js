import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css'
import './assets/icon/iconfont.css'
import './assets/fonts/fonts.css'
import Element from 'element-ui'
import './styles/element-variables.scss'
import '@/styles/index.scss'
import App from './App'
import store from './store'
import router from './router'
import '@/icons'
import '@/permission'
import * as filters from './filters'
import { logger, loggers } from '@/utils/ai_tool'
import clipboard from '@/directive/clipboard'
import waves from '@/directive/waves'
import { NoticeBar, List, Sticky, Dialog } from 'vant'
import 'vant/lib/index.css'
import i18n from '@/lang'
import '@/utils/fingerprint.js'
import lottie from 'vue-lottie'
import cloneDeep from 'lodash/cloneDeep'

Vue.prototype.$cloneDeep = cloneDeep
Vue.prototype.$logger = logger
Vue.prototype.$loggers = loggers

Vue.component( 'lottie', lottie )

Vue.directive( 'clipboard', clipboard )
Vue.directive( 'waves', waves )
Vue.use( Sticky )
Vue.use( List )
Vue.use( NoticeBar )
Vue.use( Dialog )
Vue.use( Element, {
  size : Cookies.get( 'size' ) || 'medium'
} )

Object.keys( filters ).forEach( key => {
  Vue.filter( key, filters[key] )
} )

Vue.config.productionTip = false

async function init() {
  // Vue.prototype.$support = false
  try {
    // const provider = await detectEthereumProvider()
    // if ( provider ) {
    //   Vue.prototype.$support = true
    // }
  } catch ( err ) {
    // Vue.prototype.$support = false
  } finally {
    new Vue( {
      el : '#app',
      router,
      store,
      i18n,
      render : h => h( App )
    } )
  }
}
init()

