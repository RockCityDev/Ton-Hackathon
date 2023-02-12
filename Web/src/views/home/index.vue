<template>
  <div class="app-section home-container">
    <div class="clearFix home-content clearFix">
      <div class="fl left">
        <div v-if="mint.status == 1 || !hasLogin" class="title">
          Mint your Fountain <br>
          ProfileNFT
        </div>
        <div v-else class="title">
          Stake your Fountain<br>
          ProfileNFT
        </div>
        <div v-if="mint.status == 1 || !hasLogin" class="description">
          Connect your Telegram & TON to mint fountain profile
        </div>
        <div v-else class="description">
          Earn Toncoin with your secure and private social graph.
        </div>
        <div v-if="mint.status == 1 || !hasLogin" class="button-item mint">
          <el-button
            :loading="mintStatus.status == 2"
            :disabled="!hasLogin"
            class="mint"
            type="primary"
            @click="mintNFT"
          >
            <span class="bth-content">
              MINT NOW
              <svg-icon icon-class="arrow-r" />
            </span>
          </el-button>
        </div>
        <div v-else-if="mint.status == 2 && hasLogin" class="button-item stake">
          <el-button :loading="stakeStatus.status == 2" class="stake" type="primary" @click="stackNFT">
            <span class="bth-content">
              STAKE NOW
            </span>
          </el-button>
        </div>
        <div v-else-if="mint.status == 3 && hasLogin" class="button-item stakeing">
          <el-button class="stakeing" type="primary">
            <span class="bth-content">
              STAKING
            </span>
          </el-button>
          <br>
          <el-button :loading="unstakeStatus.status == 2" class="unstake" type="primary" @click="unstackNFT">
            <span class="bth-content">
              Unstake
            </span>
          </el-button>
        </div>
      </div>
      <div class="fr right">
        <img :src="require('@/assets/imgs/nft.png')" alt="">
      </div>
    </div>
    <!--  Login info  -->
    <div class="tg-content clearFix">
      <div class="avatar fl" :class="{ 'has-nft' : dialog.hasNft }">
        <div class="avatar-img">
          <img :src="avatar || defaultAvatar" alt="">
        </div>
        <img
          v-if="dialog.hasNft"
          :draggable="false"
          class="nft un-select"
          src="https://d3l1ioscvnrz88.cloudfront.net/ton/nft3/collection.png"
          alt=""
        >
      </div>

      <div class="info fl">
        <div class="tg-name"> {{ tgFullName || 'No connection' }}</div>
        <div class="address"> {{ walletOriginAddress || 'No connection' }}</div>
      </div>

      <div v-if="hasLogin" class="fr setting">
        <a
          href1="https://tonscan.org/"
          href="https://testnet.tonscan.org/nft/EQBTWwvD7ugpYiIpKC5Mu3yyOT7LrN-3gYF8g2g-NSaT1WNf"
          target="_blank"
          class="el-dropdown-link tonscan"
        >
          <svg-icon icon-class="tonscan" />
        </a>

        <el-dropdown :hide-on-click="false" trigger="click">
          <span class="el-dropdown-link">
            <svg-icon icon-class="setting" />
          </span>
          <el-dropdown-menu slot="dropdown" class="home-drop-menu">
            <el-dropdown-item>
              <div class="out-btn1" @click="loginOut">
                Login Out
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!--  friends  -->
    <div class="social-content">
      <div class="search clearFix">
        <el-input
          v-model="apps.search"
          class="search-inp fl"
          placeholder="Search"
          clearable
        />
        <svg-icon icon-class="search" />
      </div>
      <div class="content clearFix">
        <div v-loading="friends.loading || connections.loading" class="fl friends">
          <div v-if="canGet && hasLogin && ( friends.total > 0 || connections.total > 0 )">
            <div class="friends-item friends-item1">
              <div class="title clearFix">
                My friends
                <svg-icon v-if="hasLogin" class-name="fr" icon-class="refresh1" @click="refreshFriends" />
              </div>
              <div class="friends-list">
                <FriendsItem
                  v-for="item in friends.list"
                  :key="item.id"
                  :detail="item"
                />
                <LoadMore
                  v-if="friends.list.length < friends.total"
                  @loadMore="getNextPage('friends')"
                />
              </div>
            </div>
            <div class="friends-item friends-item2">
              <div class="title"> 2nd Connections</div>
              <div class="friends-list">
                <FriendsItem
                  v-for="item in connections.list"
                  :key="item.id"
                  :detail="item"
                />
                <LoadMore
                  v-if="connections.list.length < connections.total"
                  @loadMore="getNextPage('connections')"
                />
              </div>
            </div>
          </div>
          <div v-else>
            <div class="title"> My friends
              <svg-icon v-if="hasLogin" class-name="fr" icon-class="refresh1" @click="refreshFriends" />
            </div>
            <div class="placeholder">
              <div class="placeholder-item clearFix">
                <div class="avatar fl">
                  <img :src="require('@/assets/imgs/placeholder-avatar.png')" alt="">
                </div>
                <div class="info fl">
                  <div class="top" />
                  <div class="bottom" />
                </div>
              </div>
              <div class="placeholder-item clearFix">
                <div class="avatar fl">
                  <img :src="require('@/assets/imgs/placeholder-avatar.png')" alt="">
                </div>
                <div class="info fl">
                  <div class="top" />
                  <div class="bottom" />
                </div>
              </div>
            </div>
            <div class="no-data">
              <span class="txt">No friends here</span>
              <span class="back-line" />
            </div>
          </div>
        </div>
        <div class="fr apps">
          <div class="apps-earned">
            <div class="get-apps">
              <el-button
                class="btn"
                :class="{'active': mint.status == 3}"
                :disabled="!hasLogin || mint.status != 3"
                @click="setEarned"
              >
                <div class="bth-content">
                  <span class="status" />
                  {{ mint.status == 3 ? 'Public' : 'Private' }} social graph
                </div>
              </el-button>
            </div>
            <div class="earned">
              <div class="tt"> Earned</div>
              <div class="earned-bottom clearFix">
                <svg-icon icon-class="ton" />
                <div class="fl earned-amount"> {{ apps.earned }}</div>

                <el-button
                  class="withdraw fr"
                  type="primary"
                  :disabled="apps.earned <= 0"
                > Withdraw
                </el-button>
              </div>
            </div>
          </div>
          <div v-if="hasLogin && apps.total > 0" class="app-list--content">
            <div class="title"> ADpps</div>
            <div v-if="apps.total > 0" class="app-list">
              app
            </div>
            <div class="no-apps">
              <div class="no-data">
                <span class="txt">  No DApps here</span>
                <span class="back-line" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FriendsItem from '@/views/component/FriendsItem'
import LoadMore from '@/views/component/LoadMore'
import {
  getAddressAndStateInit, useSlicedAddress
} from '@/views/home/nft-transaction'
import { connector, sendTransaction } from '@/views/component/TonConnect'
import { clearStorage, addStorageBy, getStorageBy, clearAllStorage } from '@/utils/auth'
import { userList } from './list'

const defaultAvatar = require( '@/assets/imgs/default_avatar.png' )

export default {
  name : 'Home',
  components : { FriendsItem, LoadMore },
  data() {
    return {
      canGet : false,
      // wallet : null,
      defaultAvatar,
      dialog : {
        tx : null,
        sendTo : '', // NFT 发送钱包地址
        originAddress : '', // 原始钱包地址
        encryptionAddress : '', // 加了省略号得地址
        hasNft : false
      },
      friends : {
        loading : false,
        total : 0,
        list : [],
        pagination : {
          page : 1,
          pageSize : 5
          // total : 0
        }
      },
      connections : {
        loading : false,
        total : 0,
        list : [],
        pagination : {
          page : 1,
          pageSize : 5
          // total : 0
        }
      },
      apps : {
        canPublic : false, // 是否获取过收益
        search : '', // 搜索关键词
        earned : 0, // 总收益
        total : 0,
        list : []
      },
      mint : {
        status : 1 // 1 未 mint ， 2 已mint 未 stack， 3 已stack
        // title : '',
        // description : '',
      }
    }
  },
  computed : {
    ...mapGetters( [
      'tgFullName',
      'avatar',
      'walletsList',
      'embeddedWallet',
      'walletEncryptionAddress',
      'walletOriginAddress',
      'walletInfo',
      'mintStatus',
      'stakeStatus',
      'unstakeStatus',
      'walletConnector'
    ] ),
    hasLogin() {
      const tgFullName = this.tgFullName
      const walletOriginAddress = this.walletOriginAddress
      return !!( tgFullName && walletOriginAddress )
    }
  },
  watch : {
    // 'walletOriginAddress' : {
    //   handler( res ) {
    //     // console.log( 'walletOriginAddress', res )
    //   },
    //   deep : true
    // },
    'mintStatus' : {
      handler( res ) {
        addStorageBy( 'ton_mintStatus', res.status )
        // 0 未开始 1 提交mint ， 2 mint 中， 3 成功 4 失败
        const { status } = res
        if ( status == 3 ) {
          // 1 未 mint ， 2 已mint 未 stack， 3 已stack
          this.mint.status = 2
        } else {
          this.mint.status = 1
        }
        // console.log( 'walletOriginAddress', res )
      },
      deep : true
    },
    'stakeStatus' : {
      handler( res ) {
        addStorageBy( 'ton_stakeStatus', res.status )
      },
      deep : true
    },
    'unstakeStatus' : {
      handler( res ) {
        addStorageBy( 'ton_unstakeStatus', res.status )
      },
      deep : true
    },
    'mint' : {
      handler( res ) {
        const { status } = res
        // status : 1 // 1 未 mint ， 2 已mint 未 stack， 3 已stack
        // console.log( 'ton_mint_status', status, res )

        this.dialog.hasNft = this.hasLogin && status >= 2
        addStorageBy( 'ton_mint_status', status )
      },
      deep : true
    },
    'hasLogin' : {
      handler( status ) {
        // console.log( 'hasLogin', status )
        if ( status ) {
          const ton_mint_status = getStorageBy( 'ton_mint_status' )
          this.dialog.hasNft = this.mint.status >= 2
          if ( ton_mint_status && JSON.stringify( ton_mint_status ) != '{}' ) {
            this.mint.status = ton_mint_status || 1
          } else {
            this.mint.status = 1
          }
          this.apps.earned = this.getEarned() || 0
        }
        // else {
        //   this.mint.status = 1
        // }
      },
      immediate : true,
      deep : true
    }
  },
  created() {
    this.loading = true
    const that = this
    connector.restoreConnection()
    connector.onStatusChange(
      walletInfo => {
        that.formatAddress( walletInfo, connector )
      },
      ( error ) => {
        console.log( 'home onStatusChange Error:', error )
        this.$store.dispatch( 'walletList/setWalletInfo', {
          walletInfo : undefined,
          connector : undefined,
          originAddress : '',
          encryptionAddress : ''
        } )
      }
    )
  },
  mounted() {
    this.getFriendsList()
    this.getConnectionsList()
  },
  methods : {
    // 获取收益总额
    getEarned() {
      console.log( 88888888, this.mint.status, this.hasLogin )
      try {
        const status = this.mint.status
        if ( status != 3 || !this.hasLogin ) return
        const earned = getStorageBy( 'ton_earned' )
        let amount
        console.log( 'earned', earned )
        if ( earned && JSON.stringify( earned ) != '{}' ) {
          amount = earned
        } else {
          amount = 0
        }
        console.log( 'amount', amount )
        return amount
      } catch ( e ) {
        console.log( 'eeee', e )
        return 0
      }
    },
    async setEarned() {
      try {
        const status = this.mint.status
        if ( status != 3 || !this.hasLogin ) return
        const earned = getStorageBy( 'ton_earned' )
        let amount
        if ( earned && JSON.stringify( earned ) != '{}' ) {
          amount = earned
        } else {
          amount = 0
        }
        amount++
        this.apps.earned = amount
        addStorageBy( 'ton_earned', amount )
      } catch ( e ) {

      }
    },
    // 刷新好友列表
    async refreshFriends() {
      try {
        this.initPage( 'friends' )
        this.initPage( 'connections' )
        this.canGet = true
        setTimeout( () => {
          this.getFriendsList()
          this.getConnectionsList()
        }, 500 )
      } catch ( e ) {
        this.canGet = false
      }
    },
    async loginOut() {
      try {
        clearAllStorage()
        connector.disconnect()
        this.$store.dispatch( 'user/LoginOut' )
        this.$store.dispatch( 'walletList/resetWalletInfo' )
      } catch ( e ) {
      } finally {
        window.location.reload()
      }
    },
    async mintNFT() {
      if ( !this.hasLogin ) {
        this.$message.warning( 'Please login' )
        return
      }
      if ( this.mintStatus.status == 2 ) return
      this.$store.dispatch( 'walletList/mintHandle', {
        status : 1 // 0 未开始 1 提交mint ， 2 mint 中， 3 成功 4 失败
      } )
    },
    async stackNFT() {
      if ( !this.hasLogin ) {
        this.$message.warning( 'Please login' )
        return
      }
      if ( this.stakeStatus.status == 2 ) return
      this.$store.dispatch( 'walletList/stakeHandle', {
        status : 1 // 0 未开始 1 提交mint ， 2 mint 中， 3 成功 4 失败
      } )

      this.$store.dispatch( 'walletList/stakeHandle', {
        status : 2
      } )

      setTimeout( () => {
        this.$store.dispatch( 'walletList/stakeHandle', {
          status : 3
        } )
        // status : 1 // 1 未 mint ， 2 已mint 未 stack， 3 已stack
        this.mint.status = 3
      }, 6000 )
    },
    async unstackNFT() {
      if ( !this.hasLogin ) {
        this.$message.warning( 'Please login' )
        return
      }
      if ( this.unstakeStatus.status == 2 ) return
      this.$store.dispatch( 'walletList/unstakeHandle', {
        status : 1 // 0 未开始 1 提交请求 ， 2 mint 中， 3 成功 4 失败
      } )

      this.$store.dispatch( 'walletList/unstakeHandle', {
        status : 2
      } )

      setTimeout( () => {
        this.$store.dispatch( 'walletList/unstakeHandle', {
          status : 3
        } )
        this.mint.status = 2

        this.apps.earned = 0
        addStorageBy( 'ton_earned', 0 )
      }, 2000 )
    },
    initPage( type = 'friends' ) {
      this[type]['pagination']['page'] = 1
      this[type]['pagination']['pageSize'] = 5
      this[type]['list'] = []
      this[type]['total'] = 0
    },
    async getNextPage( type = 'friends' ) {
      return new Promise( async( resolve, reject ) => {
        try {
          this[type]['pagination']['page']++
          if ( this[type]['list']['length'] >= this[type]['total'] ) {
            return
          }
          let method
          // eslint-disable-next-line default-case
          switch ( type ) {
            case 'friends':
              method = this.getFriendsList
              break
            case 'connections':
              method = this.getConnectionsList
              break
          }
          await method( {
            page : this[type]['pagination']['page'],
            pageSize : this[type]['pagination']['pageSize']
          } )
          resolve()
        } catch ( e ) {
          reject( e )
        }
      } )
    },
    // // 获取收益总额
    // async getEarned() {
    //   return new Promise( async( resolve, reject ) => {
    //     try {
    //       const params = {
    //
    //       }
    //       // const { data } = await getTransferList( params )
    //       this.apps.earned = 0
    //       this.apps.canPublic = true
    //       resolve()
    //     } catch ( e ) {
    //       this.apps.canPublic = false
    //       reject( e )
    //     }
    //   } )
    // },
    async getFriendsList( pageInfo ) {
      return new Promise( async( resolve, reject ) => {
        if ( pageInfo ) {
          this.friends.pagination.page = pageInfo.page
          this.friends.pagination.pageSize = pageInfo.pageSize
        }
        try {
          this.friends.loading = true
          const params = {
            page : this.friends.pagination.page,
            pageSize : this.friends.pagination.pageSize
          }

          const list = []
          const page = params.page
          const pageSize = params.pageSize
          const total = 10
          for ( let i = ( page - 1 ) * pageSize; i < page * pageSize; i++ ) {
            // const obj = {
            //   id : i + 1,
            //   // avatar : require( `@/assets/avatar/avatar${i + 1}.png` ),
            //   name : i + '_Joshua Lawrence',
            //   address : 'kQD9B86w3N9QitH9VaJw8_9whFMtolPAVzJHEV8x_vH9Y6EJ'
            // }

            const obj = {
              ...userList[i]
            }
            list.push( obj )
          }

          // const { data } = await getTransferList( params )
          this.friends.list = this.friends.list.concat( list )
          this.friends.total = total
          resolve()
        } catch ( e ) {
          console.log( 'safe pagination', e )
          reject( e )
        } finally {
          this.friends.loading = false
        }
      } )
    },
    async getConnectionsList( pageInfo ) {
      return new Promise( async( resolve, reject ) => {
        if ( pageInfo ) {
          this.connections.pagination.page = pageInfo.page
          this.connections.pagination.pageSize = pageInfo.pageSize
        }
        try {
          this.connections.loading = true
          const params = {
            page : this.connections.pagination.page,
            pageSize : this.connections.pagination.pageSize
          }
          const list = []
          const page = params.page
          const pageSize = params.pageSize
          const total = 10
          for ( let i = ( page - 1 ) * pageSize; i < page * pageSize; i++ ) {
            // const obj = {
            //   id : i + 1,
            //   name : i + '_Joshua Lawrence',
            //   address : 'kQD9B86w3N9QitH9VaJw8_9whFMtolPAVzJHEV8x_vH9Y6EJ'
            // }
            const obj = {
              ...userList[i + 10]
            }
            list.push( obj )
          }
          // const { data } = await getTransferList( params )
          this.connections.list = this.connections.list.concat( list )
          this.connections.total = total
          resolve()
        } catch ( e ) {
          console.log( 'connections pagination', e )
          reject( e )
        } finally {
          this.connections.loading = false
        }
      } )
    },

    formatAddress( walletInfo ) {
      return new Promise( ( resolve, reject ) => {
        try {
          // console.log( '1 钱包链接成功:', walletInfo )
          if ( !walletInfo ) {
            return
          }
          const { address, chain } = walletInfo.account
          const { originAddress, encryptionAddress } = useSlicedAddress( address, chain )
          const res = getAddressAndStateInit( address )

          this.$store.dispatch( 'walletList/setWalletInfo', {
            originAddress,
            encryptionAddress,
            walletInfo,
            connector
          } )

          const result = {
            address,
            originAddress,
            encryptionAddress,
            chain,
            stateInit : res.stateInit,
            address1 : res.address
          }
          console.log( 'formatAddress', { ...result } )
          resolve( result )
        } catch ( error ) {
          reject( error )
        }
      } )
    },
    formatParams( walletInfo ) {
      return new Promise( async( resolve, reject ) => {
        try {
          const result = await this.formatAddress( walletInfo )
          const {
            address,
            originAddress,
            encryptionAddress,
            chain,
            stateInit,
            address1
          } = result

          // console.log( 'formatParams', { ...result } )

          // console.log( '1 钱包链接成功:', walletInfo )
          // const { address, chain } = walletInfo.account
          // const { originAddress, encryptionAddress } = useSlicedAddress( address, chain )
          // console.log( 'addressStr', originAddress )
          // console.log( 'encryptionAddress', encryptionAddress )
          // this.dialog.originAddress = originAddress
          // this.dialog.encryptionAddress = encryptionAddress
          //
          // this.$store.dispatch( 'walletList/setWalletInfo', {
          //   originAddress,
          //   encryptionAddress,
          //   walletInfo,
          //   connector
          // } )
          //
          // // const walletAddress = connector.wallet.account.address || address
          // const res = getAddressAndStateInit( address )
          // // const { address, stateInit } = res
          // console.log( 'getAddressAndStateInit', res )

          const tx = {
            validUntil : Date.now() + 1000000,
            messages : [
              {
                address,
                amount : '100000000', // 0.01 ton, 10 ** 10
                // 要添加到事务的特定于合约的数据
                stateInit
              }
            ]
          }
          this.dialog.tx = tx
          // console.log( 'tx', tx )
          // this.dialog.sendTo = ''
          resolve( tx )
        } catch ( error ) {
          this.dialog.tx = null
          this.dialog.sendTo = ''
          this.dialog.originAddress = ''
          this.dialog.encryptionAddress = ''
          reject( error )
        }
      } )
    },
    async send() {
      const walletInfo = this.walletInfo
      if ( walletInfo ) {
        const tx = this.formatParams( walletInfo )
        const hash = await sendTransaction( tx )
        // console.log( 'hash', hash )
      } else {
        this.$message.warning( '请重新钱包登录' )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .home-container {
    padding: calc(97px * 0.53) calc(133px * 0.53) calc(97px * 0.53) calc(156px * 0.53);
  }

  .home-content {
    .left {
      width: calc(100% - (673px * 0.53));

      .title {
        height: calc(250px * 0.53);
        line-height: calc(125px * 0.53);
        font-size: calc(100px * 0.53);
        margin-bottom: calc(58px * 0.53);
        font-family: Helvetica Neue-Bold, Helvetica Neue, syBold;
        font-weight: bold;
        color: #fff;
      }

      .description {
        height: calc(42px * 0.53);
        line-height: calc(42px * 0.53);
        font-size: calc(36px * 0.53);
        margin-bottom: calc(106px * 0.53);
        font-family: Helvetica Neue-Regular, Helvetica Neue, syBold;
        font-weight: 400;
        color: #fff;
      }

      .button-item {
        .el-button {
          width: calc(412px * 0.53);
          height: calc(90px * 0.53);
          line-height: calc(90px * 0.53);
          border-radius: calc(90px * 0.53);
          font-size: calc(36px * 0.53);
          padding: 0;
          margin: 0;
          font-family: Roboto-Medium, Roboto, syMedium;
          font-weight: 500;
          color: #fff;
          text-align: center;
          border: none;

          .bth-content {
            display: inline-block;

            .svg-icon {
              color: #fff;
              width: calc(40px * 0.53);
              height: calc(40px * 0.53);
            }
          }

          &:hover {
            background: #3CB3F0;
          }

          &:active {
            background: #167EB4;
          }

          &.stake {
            background: #00C74D;
            border: none;

            &:hover {
              background: #2BEF77;
            }

            &:active {
              background: #16A04B;
            }
          }

          &.stakeing {
            background: transparent;
            border: 3px solid #00C74D;
            cursor: default;

            &:hover {
              background: #2BEF77;
            }

            &:active {
              background: #16A04B;
            }
          }

          &.unstake {
            margin-top: 10px;
            background: transparent;
            border: none;
          }
        }
      }
    }

    .right {
      margin-left: calc(99px * 0.53);
      width: calc(574px * 0.53);

      img {
        width: 100%;
        height: auto;
      }
    }
  }

  .tg-content {
    width: calc(1790px * 0.53);
    width: 100%;
    margin: calc(71px * 0.53) auto;
    height: calc(266px * 0.53);
    padding: calc(44px * 0.53) calc(70px * 0.53);
    border-radius: calc(30px * 0.53);

    background: #222B39;
    overflow: hidden;

    .avatar {
      width: calc(152px * 0.53);
      height: calc(152px * 0.53);
      position: relative;
      margin-right: calc(39px * 0.53);

      .avatar-img {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: calc(152px * 0.53);
        height: calc(152px * 0.53);
        border-radius: 50%;
        overflow: hidden;
      }

      img {
        width: 100%;
        height: 100%;
      }

      &.has-nft {
        margin-right: 90px;

        .nft {
          height: auto;
          position: absolute;
          z-index: 2;
          width: calc(152px * 0.53);
          top: 0;
          left: 65px;
        }
      }
    }

    .info {
      .tg-name {
        height: calc(79px * 0.53);
        line-height: calc(79px * 0.53);
        font-size: calc(60px * 0.53);
        margin-bottom: calc(21px * 0.53);

        font-family: Roboto-Medium, Roboto, syMedium;
        font-weight: 500;
        color: #fff;
      }

      .address {
        height: calc(39px * 0.53);
        line-height: calc(39px * 0.53);
        font-size: calc(30px * 0.53);
        font-family: Roboto-Regular, Roboto, syRegular;
        font-weight: 400;
        color: #7E7E82;
      }
    }

    .setting {
      cursor: pointer;

      .el-dropdown-link {
        display: inline-block;
        width: calc(88px * 0.53);
        height: calc(88px * 0.53);
        border-radius: 50%;
        overflow: hidden;
        background: transparent;
        transition: all 0.36s;
        padding-top: 3px;
        text-align: center;

        &:hover {
          background: transparent;
        }

        &:active {
          background: #A0A0A0;
        }
      }

      .tonscan {
        margin-right: calc(28px * 0.53);
      }

      .svg-icon {
        width: calc(80px * 0.53);
        height: calc(80px * 0.53);
        color: #fff;
      }
    }
  }

  .social-content {

  }

  .search {
    border-bottom: 1px solid #707070;
    margin-bottom: calc(52px * 0.53);
    padding-bottom: calc(15px * 0.53);

    .search-inp {
      float: left;
      width: calc(100% - 133px * 0.53);
      height: calc(60px * 0.53);
      line-height: calc(60px * 0.53);
      font-size: calc(46px * 0.53);
      font-family: Roboto-Medium, Roboto, syMedium;
      font-weight: 500;
      color: #fff;
      background: transparent;
      border: none;

      /deep/ .el-input__inner {
        height: calc(60px * 0.53);
        line-height: calc(60px * 0.53);
        font-size: calc(46px * 0.53);
        font-family: Roboto-Medium, Roboto, syMedium;
        font-weight: 500;
        color: #fff;
        background: transparent;
        border: none;
        padding: 0;
        padding-left: 5px;
      }
    }

    .svg-icon {
      float: right;
      width: calc(60px * 0.53);
      height: calc(60px * 0.53);
      color: #A0A4AA;
      cursor: pointer;
      margin-right: 5px;
      margin-right: 2px;
    }
  }

  .content {

  }

  .friends {
    .title {
      height: calc(39px * 0.53);
      font-size: calc(30px * 0.53);
      line-height: calc(39px * 0.53);
      font-family: Roboto-Medium, Roboto, syMedium;
      font-weight: 500;
      color: #fff;

      .svg-icon {
        color: #fff;
        width: calc(80px * 0.53);
        height: calc(80px * 0.53);
        cursor: pointer;
        position: relative;
        top: -12px;
      }
    }

    .friends-list {
      padding-top: calc(37px * 0.53);
      width: calc(870px * 0.53);

      .load-more {
        margin-top: 15px;
      }
    }

    .friends-item {
      margin-bottom: calc(71px * 0.53);

      .svg-icon {
        color: #fff;
        width: calc(80px * 0.53);
        height: calc(80px * 0.53);
        cursor: pointer;
        position: relative;
        top: -12px;
      }
    }

    .placeholder {
      padding-top: calc(37px * 0.53);
    }

    .no-data {
      margin-top: calc(154px * 0.53);
    }
  }

  .apps {

  }

  .apps-earned {
    border-radius: calc(20px * 0.53);
    padding: calc(41px * 0.53) calc(30px * 0.53);
    border: 1px solid #707070;

    .get-apps {
      margin-bottom: calc(63px * 0.53);

      .el-button {
        width: calc(686px * 0.53);
        height: calc(114px * 0.53);
        line-height: calc(114px * 0.53);
        border-radius: calc(20px * 0.53);
        font-size: calc(36px * 0.53);
        border: none;
        background: #263242;
        padding: 0;
        margin: 0;
        cursor: pointer;
        font-family: Roboto-Medium, Roboto, syMedium;
        font-weight: 500;
        color: #fff;

        .status {
          width: calc(18px * 0.53);
          height: calc(18px * 0.53);
          margin-right: calc(22px * 0.53);
          display: inline-block;
          background: #737A85;
          overflow: hidden;
          border-radius: 50%;
        }

        &.active {
          .status {
            background: #32CB4B;
          }

          color: #32CB4B;
        }
      }
    }

    .earned {
      .tt {
        height: calc(37px * 0.53);
        font-size: calc(27px * 0.53);
        line-height: calc(37px * 0.53);
        margin-bottom: calc(8px * 0.53);
        font-family: Poppins-Regular, Poppins, syRegular;
        font-weight: 400;
        color: #7E7E82;
      }

      .earned-bottom {
        height: calc(88px * 0.53);

        .svg-icon {
          width: calc(62px * 0.53);
          height: calc(62px * 0.53);
          margin-right: calc(70px * 0.53);
          margin-top: 6px;
          color: #fff;
          float: left;
        }

        .earned-amount {
          height: calc(80px * 0.53);
          font-size: calc(60px * 0.53);
          line-height: calc(80px * 0.53);
          float: left;
          font-family: Roboto-Medium, Roboto, syMedium;
          font-weight: 500;
          color: #fff;
        }

        .withdraw {
          width: calc(343px * 0.53);
          height: calc(90px * 0.53);
          line-height: calc(90px * 0.53);
          border-radius: calc(90px * 0.53);
          font-size: calc(36px * 0.53);
          padding: 0;
          margin: 0;
          font-family: Roboto-Medium, Roboto, syMedium;
          font-weight: 500;
          color: #fff;
          text-align: center;

          .bth-content {

          }
        }
      }
    }
  }

  .app-list--content {
    margin-top: calc(78px * 0.53);

    .title {
      height: calc(39px * 0.53);
      font-size: calc(30px * 0.53);
      font-family: Roboto-Medium, Robot, syMedium;
      font-weight: 500;
      color: #fff;
    }

    .no-apps {
      margin-top: calc(262px * 0.53);
    }
  }

  .no-data {
    position: relative;
    text-align: center;

    width: calc(700px * 0.53);
    background: red;

    .txt {
      height: calc(48px * 0.53);
      font-size: calc(36px * 0.53);
      line-height: calc(48px * 0.53);
      padding: 0 calc(51px * 0.53);
      width: 220px;

      font-family: Roboto-Regular, Roboto, syRegular;
      font-weight: 400;
      color: #7E7E82;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #151E2D;
      z-index: 2;
    }

    .back-line {
      width: 100%;
      background: #7E7E82;
      height: 1px;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      z-index: 1;
    }
  }

  .placeholder-item {
    margin-bottom: calc(33px * 0.53);

    .avatar {
      width: calc(88px * 0.53);
      height: calc(88px * 0.53);
      margin-right: calc(22px * 0.53);
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .info {
      .top {
        width: calc(283px * 0.53);
        height: calc(35px * 0.53);
        margin-bottom: calc(14px * 0.53);
        background: #1A2433;
      }

      .bottom {
        width: calc(570px * 0.53);
        height: calc(28px * 0.53);
        background: #1A2433;
      }
    }
  }
</style>

<style lang="scss">
  .el-dropdown-menu {
    &.home-drop-menu {
      padding: 0;
      border: none;
      transform: translate(0px, -10px);
      background: transparent;

      .popper__arrow {
        display: none;
      }

      .el-dropdown-menu__item {
        background: #334358;
        width: calc(250px * 0.53);
        height: calc(68px * 0.53);
        line-height: calc(68px * 0.53);
        border-radius: calc(15px * 0.53);
        padding: 0 calc(31px * 0.53);
        font-size: calc(20px * 0.53);
        font-family: AppleSystemUIFont-Regular, AppleSystemUIFont, syRegular;
        font-weight: 400;
        color: #fff;
        text-align: left;

        &:hover {
          background: #546883;
        }

        &:active {
          background: #1A2C43;
        }
      }
    }

  }
</style>
