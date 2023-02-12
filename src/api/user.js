
import http from '@/utils/request'

// 用户列表
export function UserList( data ) {
  return http.request( {
    method : 'post',
    url : '/v1/user/list',
    data
  } )
}

// 添加用户
export function addUser( data ) {
  return http.request( {
    method : 'post',
    url : '/v1/user/add',
    data
  } )
}

// 编辑用户
export function editUser( data ) {
  return http.request( {
    method : 'post',
    url : '/v1/user/edit',
    data
  } )
}

// 删除用户
export function deleteUser( data ) {
  return http.request( {
    method : 'post',
    url : '/v1/user/delete',
    data
  } )
}

// 重置密码
export function resetPassword( data ) {
  return http.request( {
    method : 'post',
    url : '/v1/user/resetPassword',
    data
  } )
}

// 用户信息
export function info( data ) {
  return http.request( {
    method : 'post',
    url : '/v1/user/info',
    data
  } )
}

// 普通用户获取用户信息
export function normalInfo( data ) {
  return http.request( {
    method : 'get',
    url : '/v1/user/normalInfo',
    data
  } )
}

// 普通用户修改密码
export function normalEdit( data ) {
  return http.request( {
    method : 'post',
    url : '/v1/user/normalEdit',
    data
  } )
}

