
import { GLOBAL_DATA } from '@/api/constant'

export function initUrl() {
  const envStr = getEnvs()
  const baseUrlStr = envStr === 'dev' ? process.env.VUE_APP_API_BASE_URL : GLOBAL_DATA[envStr]['baseUrl']
  const { botToken, botName } = GLOBAL_DATA[envStr]
  return {
    baseUrlStr,
    botToken,
    botName
  }
}

export function getEnvs() {
  const env = process.env.NODE_ENV
  const href = window.location.href
  let envStr = ''
  if ( env === 'development' ) {
    envStr = 'dev'
  } else {
    if ( href.indexOf( 'testing' ) >= 0 ) {
      envStr = 'fat'
    } else if ( href.indexOf( 'testing' ) >= 0 ) {
      envStr = 'uat'
    } else {
      envStr = 'pro'
    }
  }
  return envStr
}
