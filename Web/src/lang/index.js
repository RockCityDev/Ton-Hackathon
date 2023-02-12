import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { getCookieByKey } from '@/utils/auth'
import { Locale } from 'vant'

import en from 'vant/es/locale/lang/en-US'
import zh from 'vant/es/locale/lang/zh-CN'
import zhTW from 'vant/es/locale/lang/zh-TW'
// 用户自定义的语言包
import enLocale from './en'
import zhLocale from './zh'
import zhTwLocale from './zhTw'
// 注册插件
Vue.use( VueI18n )

const messages = {
  'zh-CN' : {
    ...zh,
    ...zhLocale
  },
  'zh-TW' : {
    ...zhTW,
    ...zhTwLocale
  },
  'en-US' : {
    ...en,
    ...enLocale
  }
}

export const getLocale = () => {
  // return 'en-US'
  return 'zh-TW'

  const language = navigator.language
  const locales = Object.keys( messages )
  if ( !language ) {
    return 'en-US'
  }

  for ( const locale of locales ) {
    if ( language.indexOf( locale ) > -1 ) {
      document.documentElement.lang = locale
      return locale
    }
  }
  return 'en-US'
}

const CURRENT_LANG = getLocale()
Locale.use( CURRENT_LANG, messages[CURRENT_LANG] )

const i18n = new VueI18n( {
  locale : CURRENT_LANG,
  messages
} )

export default i18n
