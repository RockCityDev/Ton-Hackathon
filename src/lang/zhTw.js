export default {
  head : {
    title : 'Alphagram',
    loginOut : '退出',
    more : '體驗更多幣圈群組',
    dialogTitle : '登出或切換帳號',
    tt : '要登出或切換帳號，請先在您的 Telegram App 按照以下步驟操作：',
    step1 : '1. 打開 Telegram App，進入到 "Settings" 頁面；',
    step2 : '2. 點擊 "Privacy and Security"，然後在 Bots and website 裡選擇 "Logged In With Telegram"；',
    step3 : '3. 點擊 Disconnect All Websites',
    step4 : '完成以上操作後重新載入此頁面，點擊頭像下方的“退出”即可。',
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
    tt : '入群價格',
    join : '加入群聊',
    remarks : '加入群組需先授權 Telegram 帳號',
    missParams : '缺少參數，請重新取得分享連結',
    getDetailsFail : '取得群組訊息失敗，請稍後再試',
    noId : '缺少群組 ID',
    loginFail : '登入失敗',
    authFail : '授權登入失敗，請稍候再試',
    checkTgConfig : '請檢測您的 tg bot 相關配置是否正確',
    loginSuccess : '登入成功',
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
    title : '支付訂單確認',
    tg : '入群許可',
    members : '人已付費',
    status : '狀態',
    unBind : '未綁定錢包',
    balance : '餘額：',
    from : 'From:',
    to : 'To:',
    total : '總額：',
    walletLogin : '登入錢包',
    payNow : '立即支付',
    payFail : '支付失敗',
    paying : '正在支付',
    desc : '請您從錢包支付視窗完成支付',
    continue : '繼續支付',
    contact : '已支付？聯絡客服',
    missParams : '缺少參數，請重新取得分享連結',
    authFail : '錢包登入授權失敗',
    getBalanceFail : '取得餘額資訊出錯',
    createOrderFail : '訂單建立失敗',
    connectWallet : '連結你的數位錢包',
    selectWallet : '選擇一個我們支援的數位貨幣錢包',
    recommend : '推薦',
    back : '返回',
    waitTitle : '上鏈驗證中...',
    waitSubTitle : '大約需要 30s，請耐心等候'
  },
  result : {
    status : '支付成功！',
    desc : '🎉 恭喜成為我們的一員 🎉',
    join : '驗證成功，歡迎進群',
    download : '下載 alphagram',
    waitMsg : '您的訂單支付訊息可能正在上鏈或其他原因，請等待成功上鏈後再試',
    notice : '入群成功連結有效時間有限，請儘速入群'
  },
  wallet : {
    chainCheck1 : '目前此錢包的鏈不在 ', //  '当前钱包链不是${targetChainName},请切换至该链'
    chainCheck2 : ',請切換至該鏈',
    chainIdCheck1 : '目前此錢包的鏈 ID 不為 ', // '当前钱包链ID不为${chain_id},请切换后再试'
    chainIdCheck2 : '，請切換後再試',
    noInstance : '實例不存在'
  },
  request : {
    err400 : '請求錯誤',
    err401 : '尚未授權，請重新登入',
    err403 : '拒絕訪問',
    err404 : '請求錯誤，尚未找到此資源',
    err405 : '請求方法未允許',
    err408 : '請求逾時',
    err500 : '伺服器發生錯誤',
    err501 : '網路未實現',
    err502 : '網路發生錯誤',
    err503 : '服務不可用',
    err504 : '網路逾時',
    err505 : 'http版本不支援此請求',
    connectError : '連接錯誤',
    networkError : '請檢查您的網路是否正常',
    timeout : '網路請求逾時',
    serviceError : '連接到伺服器失敗',
    loginError : '登入失敗'
  },
  router : {
    home : '首頁',
    waitPay : '等待支付',
    paySuccess : '支付成功'
  },
  credentials : {
    checking : '授權驗證中...',
    auth : '請在打開的 MetaMask 中授權簽名',
    msg : '審核條件：',
    Hold : '持有',
    validate : '驗證群聊',
    noBalance : '余额不足'
  }
}
