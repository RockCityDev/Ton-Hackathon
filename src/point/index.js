
// 埋点信息
import { sendCustomPoint } from '@/api/group'
import { getStorageBy } from '@/utils/auth'
import { USER_ACTION_POST } from '@/api/constant'

// 首页访问 埋点
export async function pointHomeView() {
  const browserId = getStorageBy( 'browserId' )
  try {
    const params = {
      ...USER_ACTION_POST.home.view,
      device : browserId
    }
    await sendCustomPoint( params )
  } catch ( e ) {
    console.log( '首页访问 埋点失败', e )
  }
}

// 点击搜索 埋点
export async function pointClickSearch() {
  const browserId = getStorageBy( 'browserId' )
  try {
    const params = {
      ...USER_ACTION_POST.search.clickSearch,
      device : browserId
    }
    await sendCustomPoint( params )
  } catch ( e ) {
    console.log( '点击搜索 埋点失败', e )
  }
}
// 点击tg登录 埋点
export async function pointTgLogin() {
  const browserId = getStorageBy( 'browserId' )
  try {
    const params = {
      ...USER_ACTION_POST.home.tgLogin,
      device : browserId
    }
    await sendCustomPoint( params )
  } catch ( e ) {
    console.log( '点击tg登录 埋点失败', e )
  }
}
// 用户信息查看 按钮点击 埋点
export async function pointUserInfoView() {
  const browserId = getStorageBy( 'browserId' )
  try {
    const params = {
      ...USER_ACTION_POST.userInfo.view,
      device : browserId
    }
    await sendCustomPoint( params )
  } catch ( e ) {
    console.log( '点击搜索 埋点失败', e )
  }
}
// 用户登出 按钮点击 埋点
export async function pointLoginOut() {
  const browserId = getStorageBy( 'browserId' )
  try {
    const params = {
      ...USER_ACTION_POST.userInfo.loginOut,
      device : browserId
    }
    await sendCustomPoint( params )
  } catch ( e ) {
    console.log( '点击搜索 埋点失败', e )
  }
}

// 搜索页面访问 埋点
export async function pointSearchView() {
  const browserId = getStorageBy( 'browserId' )
  try {
    const params = {
      ...USER_ACTION_POST.search.view,
      device : browserId
    }
    await sendCustomPoint( params )
  } catch ( e ) {
    console.log( '搜索页面访问 埋点失败', e )
  }
}

// 群详情页面访问 埋点
export async function pointGroupDetailView() {
  const browserId = getStorageBy( 'browserId' )
  try {
    const params = {
      ...USER_ACTION_POST.detail.view,
      device : browserId
    }
    await sendCustomPoint( params )
  } catch ( e ) {
    console.log( '群详情页面访问 埋点失败', e )
  }
}
