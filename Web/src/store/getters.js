const getters = {
  sidebar : state => state.app.sidebar,
  size : state => state.app.size,
  device : state => state.app.device,
  visitedViews : state => state.tagsView.visitedViews,
  cachedViews : state => state.tagsView.cachedViews,
  permission_routes : state => state.permission.routes,

  token : state => state.user.token,
  roles : state => state.user.roles,
  avatar : state => state.user.avatar,
  tgFullName : state => state.user.tgFullName,
  tgLoginInfo : state => state.user.tgLoginInfo,
  tgLoginStatus : state => state.user.tgLoginStatus,

  walletsList : state => state.walletList.walletsList,
  embeddedWallet : state => state.walletList.embeddedWallet,
  walletInfo : state => state.walletList.walletInfo,
  walletConnector : state => state.walletList.walletConnector,
  walletEncryptionAddress : state => state.walletList.encryptionAddress,
  walletOriginAddress : state => state.walletList.originAddress,
  mintStatus : state => state.walletList.mintStatus,
  stakeStatus : state => state.walletList.stakeStatus,
  unstakeStatus : state => state.walletList.unstakeStatus,

}

export default getters
