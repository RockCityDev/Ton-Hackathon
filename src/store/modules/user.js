
import { getCookieByKey, setCookie, clearAllCookies, clearStorage, addStorageBy, getStorageBy } from '@/utils/auth'
import { resetRouter } from '@/router'
import { COOKIE_PREFIX, TOKEN } from '@/api/constant'
import { loginWithTg, getUserInfoByToken } from '@/api/login'
import i18n from '@/lang'

const initInfo = getStorageBy( 'tgLoginInfo' )
const defaultAvatar = require( '@/assets/imgs/avatar01.png' )

const state = {
  token : getCookieByKey( TOKEN ),
  roles : [],
  tgLoginInfo : initInfo || {},
  tgLoginStatus : 1, // 1 未开始， 2 登陆中 3 成功 4 失败

  avatar : '',
  username : '',
  tgFullName : '',
  tg_uid : '',
  auth_date : '',
  newer : ''
}

const mutations = {
  SET_TG_LOGIN_INFO : ( state, info ) => {
    state.tgLoginInfo = info || {}
  },
  SET_TG_LOGIN_STATUS : ( state, status ) => {
    state.tgLoginStatus = status || 1
  },
  SET_TOKEN : ( state, token ) => {
    state.token = token || ''
  },
  SET_USER_INFOS : ( state, data ) => {
    // state.chain_icon = data.chain_icon || ''
    // state.chain_id = data.chain_id || ''
    // state.desc = data.desc || ''
    // state.is_bind_wallet = data.is_bind_wallet || 1
    // state.is_show_wallet = data.is_show_wallet || 1
    // state.name = data.name || ''
    // state.nft_contract = data.nft_contract || ''
    // state.nft_contract_image = data.nft_contract_image || ''
    // state.nft_photo_id = data.nft_photo_id || ''
    // state.nft_token_id = data.nft_token_id || ''
    // state.region = data.region || ''
    // state.sticker = data.sticker || ''
    // state.tg_user_id = data.tg_user_id || ''
    // state.user_id = data.user_id || ''
    //
    state.avatar = data.avatar || defaultAvatar
    state.tgFullName = data.tgFullName || ''
    // state.tg_uid = data.tg_uid || ''
    // state.auth_date = data.auth_date || ''
    // state.newer = data.newer || ''
    // state.username = data.username || ''
    // state.roles = data.roles || []
  },
  CLEAR_USER_INFOS : ( state ) => {
    state.avatar = defaultAvatar
    // state.chain_icon = ''
    // state.chain_id = ''
    // state.desc = ''
    // state.is_bind_wallet = 1
    // state.is_show_wallet = 1
    // state.name = ''
    // state.nft_contract = ''
    // state.nft_contract_image = ''
    // state.nft_photo_id = ''
    // state.nft_token_id = ''
    // state.region = ''
    // state.sticker = ''
    // state.tg_user_id = ''
    // state.user_id = ''
    state.roles = []

    // state.username = ''
    state.tgFullName = ''
    // state.tg_uid = ''
    // state.auth_date = ''
    // state.newer = ''
  },
  SET_AVATAR : ( state, avatar ) => {
    state.avatar = avatar || defaultAvatar
  },
  SET_ROLES : ( state, roles ) => {
    state.roles = roles
  }
}

const actions = {
  setTgLoginInfo( { commit, dispatch }, payload ) {
    return new Promise( ( resolve, reject ) => {
      commit( 'SET_TG_LOGIN_INFO', payload )
      addStorageBy( 'tgLoginInfo', payload )
      resolve( payload )
    } )
  },
  setTgLoginStatus( { commit, dispatch }, payload ) {
    return new Promise( ( resolve, reject ) => {
      commit( 'SET_TG_LOGIN_STATUS', payload )
      resolve( payload )
    } )
  },
  updateUserInfo( { commit, dispatch }, payload ) {
    return new Promise( ( resolve ) => {
      commit( 'SET_USER_INFOS', payload )
      for ( const key in payload ) {
        setCookie( `${COOKIE_PREFIX}_${key}`, payload[key] )
      }
      resolve( payload )
    } )
  },
  handleLoginByTid( { commit, dispatch }, payload ) {
    return new Promise( ( resolve, reject ) => {
      loginWithTg( payload )
        .then( ( response ) => {
          const { data, code } = response
          if ( !data || code != 200 ) {
            reject( i18n.t( 'request.loginError' ) )
          }
          // data.roles = ['admin']
          const { token, user, newer } = data

          commit( 'SET_TOKEN', token )
          commit( 'SET_USER_INFOS', user )

          for ( const key in data ) {
            setCookie( `${COOKIE_PREFIX}_${key}`, data[key] )
          }
          setCookie( `${COOKIE_PREFIX}_${TOKEN}`, token )
          setCookie( `${COOKIE_PREFIX}_newer`, newer )
          resolve( data )
          return data
        } )
        .catch( error => {
          dispatch( 'user/resetInfo', null, { root : true } )
          // commit('SET_LOGIN_STATUS', 4)
          reject( error )
        } )
    } )
  },
  // token 获取用户信息
  getUserInfo( { commit, dispatch } ) {
    return new Promise( ( resolve, reject ) => {
      getUserInfoByToken()
        .then( response => {
          const { data, code } = response
          if ( !data || code != 200 ) {
            reject( i18n.t( 'request.loginError' ) )
          }
          data.roles = ['admin']
          commit( 'SET_USER_INFOS', data )
          commit( 'SET_ROLES', data.roles )
          for ( const key in data ) {
            setCookie( `${COOKIE_PREFIX}_${key}`, data[key] )
          }
          resolve( data )
        } )
        .catch( error => {
          reject( error )
          dispatch( 'user/resetInfo', null, { root : true } )
          commit( 'CLEAR_USER_INFOS' )
          clearAllCookies()
          resetRouter()
        } )
    } )
  },
  // 清空所有登录信息
  resetInfo( { commit, dispatch } ) {
    return new Promise( ( resolve, reject ) => {
      clearStorage( 'walletconnect' )
      clearStorage( 'tgLoginInfo' )
      clearStorage( 'orderInfo' )
      commit( 'CLEAR_USER_INFOS' )
      clearAllCookies()
      resetRouter()
      dispatch( 'tagsView/delAllViews', null, { root : true } )
      dispatch( 'wallet/resetConnector', null, { root : true } )
      commit( 'SET_AVATAR', '' )
      resolve()
    } )
  },
  // 退出
  LoginOut( { dispatch } ) {
    return new Promise( ( resolve, reject ) => {
      dispatch( 'user/resetInfo', null, { root : true } )
      resolve()
    } )
  }
}

export default {
  namespaced : true,
  state,
  mutations,
  actions
}
