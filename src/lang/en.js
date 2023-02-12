export default {
  head : {
    title : 'Alphagram',
    loginOut : 'Sign out',
    more : 'Try More Groups',
    dialogTitle : 'Sign out or change account',
    tt : 'Please follow these steps in Telegram if you sign out or change account:',
    step1 : '1. Open Telegram App, find "Settings"；',
    step2 : '2.Click "Privacy and Security"，Choose "Logged In With Telegram" from "Bots and website"；',
    step3 : '3.Click "Disconnect All Websites"',
    step4 : 'Refresh the page, click "Sign out" under your profile photo',
    cancel : 'Cancel',
    submit : 'Sign out',
    // 新增 PC 私有
    search : 'search',
    searchGroup : '搜索群组',
    loginByTg : ' 授权登陆TG账号',
    submitLoginOut : ' 确认退出吗？',
    notice : ' 提示'
  },
  home : {
    // tt : 'Price of Joining Group',
    tt : 'Price',
    join : 'Join in',
    remarks : 'Request the authorization of Telegram account before join in ',
    missParams : 'Missing parameter, please get the share link again',
    getDetailsFail : 'Fail to get group details, please try again later',
    noId : 'Missing Group ID ',
    loginFail : 'Fail to Sign in',
    authFail : 'Authorization is failed, please try again later',
    checkTgConfig : 'Please check if your TG bot configuration is correct',
    loginSuccess : 'login successful',
    // 新增 PC 私有
    appInfo : ' GroupSpace is a communication-based verification protocol. There are two types of verification for groups, Paid Groups and Verified Groups. GroupSpace allows Web3 users to create a positive community that requires participants contributions.',
    loading : '加载中...',
    loadError : '请求失败，点击重新加载',
    noData : '暂无数据',
    total : ' 共',
    unit : ' 个',
    nums : ' 相关的群组'
  },
  pay : {
    title : 'Payment confirmation',
    tg : 'Group permission',
    members : 'Paid',
    status : 'Status',
    unBind : 'Wallet is not connected',
    balance : 'Balance: ',
    from : 'from:',
    to : 'to:',
    total : 'Total:',
    walletLogin : 'Sign in Wallet',
    payNow : 'Pay Now',
    payFail : 'Fail to pay',
    paying : 'Paying',
    desc : 'Please finish the payment on the popup window',
    continue : 'Continue to pay',
    // contact : 'Payment finished? Contact the client service',
    // contact : 'Payment finished? Contact us',
    contact : 'Contact the client service',
    missParams : 'Missing parameter, please get the share link again',
    authFail : 'Wallet authorization is failed, please try again later',
    getBalanceFail : 'Error in getting balance',
    createOrderFail : 'Fail to create an order',
    connectWallet : 'Connect to your wallet',
    selectWallet : 'Select one wallet we support',
    recommend : 'Suggestion',
    back : 'Back',
    waitTitle : 'verifying...',
    waitSubTitle : 'will take about 30s, please wait'
  },
  result : {
    status : 'payment successful! ',
    desc : '🎉 Congrats on joining us 🎉',
    join : 'Welcome to the group',
    download : 'Download Alphagram',
    waitMsg : 'Your payment is still processed on the chain or for other reasons, please wait for it is done successfully and try again',
    notice : 'Link of joining group is valid for a limited time, please join the group as soon as possible'
  },
  wallet : {
    chainCheck1 : 'Current Wallet is not', //  '当前钱包链不是${targetChainName},请切换至该链'
    chainCheck2 : ',please change',
    chainIdCheck1 : 'Current Wallet ID is not ', // '当前钱包链ID不为${chain_id},请切换后再试'
    chainIdCheck2 : ',please change and try again',
    noInstance : 'Instance does not exist'
  },
  request : {
    err400 : 'Wrong request',
    err401 : 'Unauthorized, please sign in again',
    err403 : 'Access Denied',
    err404 : 'Request error, resource not found',
    err405 : 'Request method not allowed',
    err408 : 'Request timed out',
    err500 : 'Server error',
    err501 : 'Network is not available',
    err502 : 'Network error',
    err503 : 'Service unavailable',
    err504 : 'Network timed out',
    err505 : 'The http version does not support the request',
    connectError : 'connection error',
    networkError : 'Please check if your network is working',
    timeout : 'Network request timeout',
    serviceError : 'Failed to connect to server',
    loginError : 'Login failed'
  },
  router : {
    home : 'Home',
    waitPay : 'Waiting to pay',
    paySuccess : 'Payment successful'
  },
  credentials : {
    checking : 'Verifying authorization...',
    auth : 'Please authorize the signature in the opened MetaMask',
    msg : 'Verification conditions:',
    Hold : 'Hold',
    validate : 'Verify group',
    noBalance : 'No enough balance'
  }
}
