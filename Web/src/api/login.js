
import http from '@/utils/request'

export function loginWithTg( data ) {
  return http.request( {
    method : 'post',
    url : '/v2/passport/login',
    data
  } )
}
// 根据token 获取用户信息
export function getUserInfoByToken( data ) {
  return http.request( {
    method : 'post',
    url : '/v2/user/info',
    data
  } )
}
