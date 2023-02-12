import { getStorageBy } from '@/utils/auth'

export const WX_APPID = 'appid'
export const COOKIE_PREFIX = 'ton_pc_'
export const TOKEN = `${COOKIE_PREFIX}_token`
export const ACCESS_TOKEN = `${COOKIE_PREFIX}_access_token`

export const GLOBAL_DATA = {
  env : 'fat',
  dev : {
    'baseUrl' : '/api',
    botToken : '5620129690:AAHojopbZnG-Ogb-psls_LEBGebHLVOYpbc',
    botName : 'sell_group_pc'
  },
  fat : {
    'baseUrl' : 'https://testing.alphagram.app/api',
    botToken : '5781223029:AAG2fYZTI8XNSCsBFCfBaDV0keIphu-00zg',
    botName : 'kangtk_alphagram_group_bot'
  },
  uat : {
    'baseUrl' : 'https://alphagram.app/api',
    botToken : '5781223029:AAG2fYZTI8XNSCsBFCfBaDV0keIphu-00zg',
    botName : 'kangtk_alphagram_group_bot'
  },
  pro : {
    'baseUrl' : 'https://alphagram.app/api',
    botToken : '5470526980:AAEUIqLq1u2sjBHOS7mMuEAn85yLk7UQpNw',
    botName : 'rockcity_alphagram_group_bot'
  }
}

export const WHITE_CODE_LIST = [
  {
    code : 200,
    msg : ''
  },
  {
    code : 422,
    msg : 'balance error'
  }
]

export const LOGIN_ERROR_CODE = [
  {
    code : 5004,
    msg : '无效token'
  }
]

// 用户埋点
const BASE_PLATFORM = 'TON_PC'
const browserId = getStorageBy( 'browserId' )
export const USER_ACTION_POST = {
  // 首页
  home : {
    view : {
      id : 1,
      key : `${BASE_PLATFORM}_home_view`,
      event_key : `${BASE_PLATFORM}_home_view`,
      name : `首页访问（${BASE_PLATFORM}）`,
      event_name : `首页访问（${BASE_PLATFORM}）`,
      device : browserId || ''
      // data : {}
    },
    tgLogin : {
      id : 2,
      key : `${BASE_PLATFORM}_home_tg_login`,
      event_key : `${BASE_PLATFORM}_home_tg_login`,
      name : `tg登录（${BASE_PLATFORM}）`,
      event_name : `tg登录（${BASE_PLATFORM}）`,
      device : browserId || ''
      // data : {}
    }
    // goPay : {
    //   id : 2,
    //   key : `${BASE_PLATFORM}_home_go_pay`,
    //   event_key : `${BASE_PLATFORM}_home_go_pay`,
    //   name : `加入群聊（${BASE_PLATFORM}）`,
    //   event_name : `加入群聊（${BASE_PLATFORM}）`,
    //   device : browserId || ''
    //   // data : {}
    // },
    // validate : {
    //   id : 2,
    //   key : `${BASE_PLATFORM}_home_validate_auth`,
    //   event_key : `${BASE_PLATFORM}_home_validate_auth`,
    //   name : `资格验证（${BASE_PLATFORM}）`,
    //   event_name : `资格验证（${BASE_PLATFORM}）`,
    //   device : browserId || ''
    //   // data : {}
    // }
  },
  // 用户信息
  userInfo : {
    view : {
      id : 1,
      key : `${BASE_PLATFORM}_userinfo_view`,
      event_key : `${BASE_PLATFORM}_userinfo_view`,
      name : `用户信息查看（${BASE_PLATFORM}）`,
      event_name : `用户信息查看（${BASE_PLATFORM}）`,
      device : browserId || ''
      // data : {}
    },
    loginOut : {
      id : 1,
      key : `${BASE_PLATFORM}_userinfo_login_out`,
      event_key : `${BASE_PLATFORM}_userinfo_login_out`,
      name : `用户登出（${BASE_PLATFORM}）`,
      event_name : `用户登出（${BASE_PLATFORM}）`,
      device : browserId || ''
      // data : {}
    }
  }
}
