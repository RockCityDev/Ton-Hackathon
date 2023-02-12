
// import { COOKIE_PREFIX } from '@/api/constant'
// import { getCookieByKey } from '@/utils/storage'

const state = {
  // address : '',
  walletsList : null,
  embeddedWallet : null,
  walletInfo : null,
  walletConnector : null,
  originAddress : null,
  encryptionAddress : null,
  mintStatus : { status : 0 }, // 0 未开始 1 提交mint ， 2 mint 中， 3 成功 4 失败
  stakeStatus : { status : 0 }, // 0 未开始 1 提交mint ， 2 mint 中， 3 成功 4 失败
  unstakeStatus : { status : 0 } // 0 未开始 1 提交mint ， 2 mint 中， 3 成功 4 失败
}

const mutations = {
  SET_ADDRESS : ( state, address ) => {
    state.address = address
  },
  SET_WALLET_LIST : ( state, { walletsList, embeddedWallet } ) => {
    state.walletsList = walletsList
    state.embeddedWallet = embeddedWallet
  },
  SET_WALLET_INFO : ( state, data ) => {
    const { walletInfo, connector, originAddress, encryptionAddress } = data
    state.walletInfo = walletInfo
    state.walletConnector = connector
    state.originAddress = originAddress
    state.encryptionAddress = encryptionAddress
  },
  MINT_HANDLE : ( state, { status } ) => {
    state.mintStatus.status = status
  },
  RESET_WALLET_INFO : ( state ) => {
    state.walletsList = null
    state.embeddedWallet = null
    state.walletInfo = null
    state.walletConnector = null
    state.originAddress = null
    state.encryptionAddress = null

    state.mintStatus = { status : 0 }
    state.stakeStatus = { status : 0 }
    state.unstakeStatus = { status : 0 }
  },
  STAKE_HANDLE : ( state, { status } ) => {
    state.stakeStatus.status = status
  },
  UN_STAKE_HANDLE : ( state, { status } ) => {
    state.unstakeStatus.status = status
  }
}

const actions = {
  setAddress( { commit }, payload ) {
    commit( 'SET_ADDRESS', payload )
  },
  setWalletList( { commit }, payload ) {
    commit( 'SET_WALLET_LIST', payload )
  },
  setWalletInfo( { commit }, payload ) {
    commit( 'SET_WALLET_INFO', payload )
  },
  resetWalletInfo( { commit }, payload ) {
    commit( 'RESET_WALLET_INFO', payload )
  },
  mintHandle( { commit }, payload ) {
    commit( 'MINT_HANDLE', payload )
  },
  stakeHandle( { commit }, payload ) {
    commit( 'STAKE_HANDLE', payload )
  },
  unstakeHandle( { commit }, payload ) {
    commit( 'UN_STAKE_HANDLE', payload )
  }
}

export default {
  namespaced : true,
  state,
  mutations,
  actions
}
