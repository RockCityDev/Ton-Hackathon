// zh.ts
export default {
  head : {
    title : 'Alphagram',
    loginOut : '退出',
    more : '体验更多加密群组',
    dialogTitle : '退出登录或切换账号',
    tt : '要退出或切换账号，请先在您的 Telegram App 按照以下步骤操作:',
    step1 : '1.打开 Telegram App, 进入到 "Settings" 界面；',
    step2 : ' 2.点击"Privacy and Security"，然后在Bots and website里选择 "Logged In With Telegram"；',
    step3 : '3.点击 Disconnect All Websites',
    step4 : '完成这些操作后刷新本页面，点击头像下方的“退出”即可。',
    cancel : '取消',
    submit : '退出',
    // 新增 PC 私有
    search : '搜索',
    searchGroup : '搜索群组',
    loginByTg : ' 授权登陆TG账号',
    submitLoginOut : ' 确认退出吗？',
    notice : ' 提示'
  },
  home : {
    tt : '入群价格',
    join : '加入群聊',
    remarks : '加入群组需先授权 Telegram 账号',
    missParams : '缺少参数，请重新获取分享链接',
    getDetailsFail : '获取群详情失败，请稍后再试',
    noId : '缺少群ID',
    loginFail : '登录失败',
    authFail : '授权登录失败，请稍后再试',
    checkTgConfig : '请检测您的 tg bot相关配置施是否正确',
    loginSuccess : '登录成功',
    // 新增 PC 私有
    appInfo : 'GroupSpace是一种基于通信的验证协议。有两种类型的组验证，付费组和验证组。GroupSpace允许Web3用户创建一个需要参与者贡献的积极社区。',
    loading : '加载中...',
    loadError : '请求失败，点击重新加载',
    noData : '暂无数据',
    total : ' 共',
    unit : ' 个',
    nums : ' 相关的群组'
  },
  pay : {
    title : '支付订单确认',
    tg : '入群许可',
    members : '人已付费',
    status : '状态',
    unBind : '未绑定钱包',
    balance : '余额: ',
    from : 'from:',
    to : 'to:',
    total : 'Total:',
    walletLogin : '登陆钱包',
    payNow : '马上支付',
    payFail : '支付失败',
    paying : '正在支付',
    desc : '请您从弹起的钱包支付窗口完成支付',
    continue : '继续支付',
    contact : '已支付？联系客服',
    missParams : '缺少参数，请重新获取分享链接',
    authFail : '钱包授权登录失败',
    getBalanceFail : '获取余额出错',
    createOrderFail : '订单创建失败',
    connectWallet : '链接你的数字钱包',
    selectWallet : '选择一个我们支持的数字货币钱包',
    recommend : '推荐',
    back : '返回',
    waitTitle : '上链验证中...',
    waitSubTitle : '大约需要 30s，请耐心等待'

  },
  result : {
    status : '支付成功! ',
    desc : '🎉 恭喜成为我们的一员 🎉',
    join : '验证成功，欢迎进群',
    download : '下载 Alphagram',
    waitMsg : '当前您的订单支付信息可能正在上链或其他原因，请等待订单上链成功后再试',
    notice : '入群成功链接有效时间有限，请尽快入群'
  },
  wallet : {
    chainCheck1 : '当前钱包链不是', //  '当前钱包链不是${targetChainName},请切换至该链'
    chainCheck2 : ',请切换至该链',
    chainIdCheck1 : '当前钱包链ID不为', // '当前钱包链ID不为${chain_id},请切换后再试'
    chainIdCheck2 : ',请切换后再试',
    noInstance : '实例不存在'
  },
  request : {
    err400 : '错误请求',
    err401 : '未授权，请重新登录',
    err403 : '拒绝访问',
    err404 : '请求错误,未找到该资源',
    err405 : '请求方法未允许',
    err408 : '请求超时',
    err500 : '服务器端出错',
    err501 : '网络未实现',
    err502 : '网络错误',
    err503 : '服务不可用',
    err504 : '网络超时',
    err505 : 'http版本不支持该请求',
    connectError : '连接错误',
    networkError : '请检查您的网络是否正常',
    timeout : '网络请求超时',
    serviceError : '连接到服务器失败',
    loginError : '登录失败'
  },
  router : {
    home : '首页',
    waitPay : '等待支付',
    paySuccess : '支付成功'
  },
  credentials : {
    checking : '授权验证中...',
    auth : '请在打开的 MetaMask 中授权签名',
    msg : '审核条件：',
    Hold : 'Hold',
    validate : '验证群聊',
    noBalance : '余额不足'
  }

}
