import http from '@/utils/request'

export function sendCustomPoint( data, config ) {
  return http.request( {
    method : 'post',
    url : '/v2/app/track',
    data,
    config
  } )
}

