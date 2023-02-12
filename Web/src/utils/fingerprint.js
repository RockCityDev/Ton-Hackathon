
import Fingerprint2 from '@fingerprintjs/fingerprintjs'
import { addStorageBy } from '@/utils/auth'

const getFingerprint = () => {
  return new Promise( ( resolve, reject ) => {
    try {
      // 参数只有回调函数时，默认浏览器指纹依据所有配置信息进行生成
      Fingerprint2.get( ( components ) => {
        // 配置的值的数组
        const values = components.map( component => component.value )
        // 生成浏览器指纹
        const browserId = Fingerprint2.x64hash128( values.join( '' ), 31 )

        addStorageBy( 'browserId', browserId )
        resolve( browserId )
      } )
    } catch ( e ) {
      reject( e )
    }
  } )
}
if ( window.requestIdleCallback ) {
  requestIdleCallback( async function() {
    await getFingerprint()
  } )
} else {
  setTimeout( async function() {
    await getFingerprint()
  }, 500 )
}
