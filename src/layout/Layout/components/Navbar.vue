<template>
  <!--  <van-sticky>-->
  <div class="isTop sticky-box nav-bar-box clearFix">
    <div class="mask">
      <div class="logo fl">
        <svg-icon icon-class="logo" />
        <span class="name"> FOUNTAIN  </span>
      </div>
      <div class="fr right-menu">
        <el-button v-if="!tgFullName" round class="lg-btn TG" @click="loginByTg">
          <svg-icon icon-class="guide2" />
          Login Telegram
        </el-button>
        <div v-else class="userinfo tg">
          <el-dropdown class="userinfo-container right-menu-item hover-effect" trigger="click">
            <div class="userinfo-wrapper clearFix">
              <div class="user-avatar">
                <img :src="avatar">
              </div>
              <p class="username ellipsis">
                {{ tgFullName }}
              </p>
              <i class="el-icon-arrow-down el-icon--right" />
            </div>

            <el-dropdown-menu slot="dropdown" class="nav-drop-menu tg">
              <el-dropdown-item class="item3" @click.native="logout">
                Login Out
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <el-button
          v-if="!walletOriginAddress"
          round
          type="primary"
          class="lg-btn ton"
          @click="showConnectQrcode"
        >
          <svg-icon icon-class="ton" />
          Connect TON
        </el-button>
        <div v-else class="userinfo ton">
          <el-dropdown
            class="userinfo-container right-menu-item hover-effect"
            trigger="click"
          >
            <div class="userinfo-wrapper">
              <div class="user-avatar">
                <svg-icon icon-class="ton" />
              </div>
              <p class="username ellipsis">
                {{ walletOriginAddress | formatUsername }}
              </p>
            </div>
            <el-dropdown-menu slot="dropdown" class="nav-drop-menu ton">
              <el-dropdown-item class="item3" @click.native="logoutTon">
                Login Out
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="dialog-section">
      <!--        <el-dialog title="外层 Dialog" :visible.sync="outerVisible">
          <el-dialog
            width="30%"
            title="内层 Dialog"
            :visible.sync="innerVisible"
            append-to-body>
          </el-dialog>
          <div slot="footer" class="dialog-footer">
            <el-button @click="outerVisible = false">取 消</el-button>
            <el-button type="primary" @click="innerVisible = true">打开内层 Dialog</el-button>
          </div>
        </el-dialog>-->
      <van-dialog
        v-model="dialog.visible"
        cancel-button-text="Cancel"
        :show-confirm-button="false"
        :close-on-click-overlay="false"
        confirm-button-text="OK"
        confirm-button-color="#1989fa"
        show-cancel-button
        @before-close="beforeCloseDialog"
      >
        <div slot="title" class="dialog-title"> Connect to Tonkeeper </div>
        <div class="dialog-box">
          <div class="sub-tt">
            Scan the QR code with your phone's camera or Tonkeeper.
          </div>
          <div class="qrcode">
            <QRcode
              ref="qrcode"
              width="280"
              height="280"
              :content="dialog.universalLink"
              :load="false"
            />
          </div>
          <div class="foot">
            We do not receive or store your wallet login details, so your TON is safe.
          </div>
        </div>
      </van-dialog>
    </div>
  </div>
<!--  </van-sticky>-->
</template>

<script>
import QRcode from '@/views/component/QRcode/index'
import handleTG from '@/mixins/handleTG'
import {
  useSlicedAddress, getAddressAndStateInit, encryptionAddress
  // generatePayload, getRawAddress
} from '@/views/home/nft-transaction'
import { mapGetters } from 'vuex'
import { connector, getWalletList, sendTransaction } from '@/views/component/TonConnect'
import { clearStorage, clearAllStorage } from '@/utils/auth'
// import TonWeb from 'tonweb'
// import cloneDeep from 'lodash/cloneDeep'

const defaultAvatar = require( '@/assets/imgs/avatar01.png' )
const avatar1 = require( '@/assets/imgs/testAvatar.png' )

export default {
  components : {
    QRcode
  },
  mixins : [handleTG],
  data() {
    return {
      tgToken : '',
      requestEnd : false,
      loginInfo : {},
      //  *************
      dialog : {
        visible : false,
        universalLink : '',
        tx : null,
        sendTo : '', // NFT 发送钱包地址
        // originAddress : 'kQD9B86w3N9QitH9VaJw8_9whFMtolPAVzJHEV8x_vH9Y6EJ', // 原始钱包地址
        originAddress : '', // 原始钱包地址
        encryptionAddress : '', // 加了省略号得地址
        test : ''
      }
    }
  },
  computed : {
    walletsListContent() {
      return {
        walletsList : this.walletsList,
        embeddedWallet : this.embeddedWallet
      }
    },
    ...mapGetters( [
      'device',
      'avatar',
      'token',
      'tgFullName',
      'walletsList',
      'embeddedWallet',
      // 'walletEncryptionAddress',
      'walletOriginAddress',
      'walletInfo',
      'mintStatus',
      'stakeStatus',
      'unstakeStatus'
      // 'walletConnector'
    ] )
  },
  watch : {
    tgLoginStatus : {
      handler( status ) {
        if ( status == 3 ) {
          this.tgLoginSuccess()
        } else if ( status == 4 ) {
          // '授权登录失败，请稍后再试'
          this.$message.error( this.$t( 'home.authFail' ) )
          this.requestEnd = true
        }
      }
      // immediate: true
    },
    mintStatus : {
      async handler( res ) {
        const { status } = res
        if ( status == 1 ) {
          // const hash = await this.sendRequest()
          const hash = await this.mintNFT()
          // console.log( 'hash', hash )
        } else if ( status == 2 ) {

        }
      },
      immediate : true,
      deep : true
    },
    stakeStatus : {
      async handler( res ) {
        const { status } = res
        if ( status == 1 ) {
          // const hash = await this.sendRequest()
          // console.log( 'hash', hash )
        }
      },
      immediate : true,
      deep : true
    },
    unstakeStatus : {
      async handler( res ) {
        const { status } = res
        if ( status == 1 ) {
          // const hash = await this.sendRequest()
          // console.log( 'hash', hash )
        }
      },
      immediate : true,
      deep : true
    }
  },
  created() {

  },
  mounted() {},
  methods : {
    async sendRequest() {
      try {
        const { address, chain } = this.walletInfo.account
        const { originAddress, encryptionAddress } = useSlicedAddress( address, chain )
        const res = getAddressAndStateInit( address )

        const tx = {
          validUntil : Date.now() + 1000000,
          messages : [
            {
              address,
              amount : '100000000', // 0.01 ton, 10 ** 10
              stateInit : res.stateInit
            }
          ]
        }
        const hash = await sendTransaction( tx )
        this.$store.dispatch( 'walletList/unstakeHandle', {
          status : 3 // 0 未开始 1 提交请求 ， 2 mint 中， 3 成功 4 失败
        } )
        return hash
      } catch ( e ) {
        this.$store.dispatch( 'walletList/unstakeHandle', {
          status : 4 // 0 未开始 1 提交请求 ， 2 mint 中， 3 成功 4 失败
        } )
        throw e
      }
    },
    async mintNFT() {
      return new Promise( async( resolve, reject ) => {
        const that = this
        try {
          this.$store.dispatch( 'walletList/mintHandle', {
            status : 2 // 0 未开始 1 提交mint ， 2 mint 中， 3 成功 4 失败
          } )

          // const tonweb = new TonWeb( new TonWeb.HttpProvider( 'https://toncenter.com/api/v2/jsonRPC', { apiKey : 'YOUR_API_KEY' } ) )
          //
          // const { NftCollection, NftItem, NftMarketplace, NftSale } = TonWeb.token.nft
          // // this.apps.earned = 0
          // // this.apps.canPublic = true
          // // this.send()
          //
          // console.log( 'walletOriginAddress', that.walletOriginAddress )
          // const walletAddress = new TonWeb.utils.Address( that.walletOriginAddress )
          // // const receive = 'kQD9B86w3N9QitH9VaJw8_9whFMtolPAVzJHEV8x_vH9Y6EJ'
          // const royaltyAddress = new TonWeb.utils.Address( walletAddress )
          // // const royaltyAddress = new TonWeb.utils.Address(receive);
          //
          // console.log( 'walletAddress', walletAddress )
          // console.log( 'royaltyAddress', royaltyAddress )
          // // console.log( 'wallet address=', walletAddress.toString( true, true, true ) )
          //
          // // https://d3l1ioscvnrz88.cloudfront.net/ton/static/my_nft.json
          // // https://d3l1ioscvnrz88.cloudfront.net/ton/static/my_collection.json
          //
          // const params = {
          //   ownerAddress : walletAddress,
          //   royalty : 0.01,
          //   royaltyAddress : royaltyAddress,
          //   // collectionContentUri : 'https://raw.githubusercontent.com/ton-blockchain/token-contract/main/nft/web-example/my_collection.json',
          //   // nftItemContentBaseUri : 'https://raw.githubusercontent.com/ton-blockchain/token-contract/main/nft/web-example/',
          //   collectionContentUri : 'https://d3l1ioscvnrz88.cloudfront.net/ton/static/my_collection.json',
          //   nftItemContentBaseUri : 'https://d3l1ioscvnrz88.cloudfront.net/ton/static/my_collection.json',
          //   nftItemCodeHex : NftItem.codeHex
          // }
          // const nftCollection = new NftCollection( tonweb.provider, params )
          // const nftCollectionAddress = await nftCollection.getAddress()
          // console.log( 'collection address=', nftCollectionAddress.toString( true, true, true ) )
          //
          // const amount = TonWeb.utils.toNano( 0.01 )
          //
          // const body = await nftCollection.createMintBody( {
          //   amount : amount,
          //   itemIndex : 0,
          //   itemOwnerAddress : walletAddress,
          //   // itemContentUri : 'my_nft.json'
          //   itemContentUri : 'https://d3l1ioscvnrz88.cloudfront.net/ton/static/my_nft.json'
          // } )
          // const bodyBoc = await body.toBoc( false )
          // const bodyBase64 = TonWeb.utils.bytesToBase64( bodyBoc )
          //
          // console.log( 'sss', {
          //   connector : connector,
          //   to : nftCollectionAddress.toString( true, true, true ),
          //   value : amount.toString(),
          //   data : bodyBase64,
          //   dataType : 'boc'
          // } )
          //
          // const tx = {
          //   validUntil : Date.now() + 1000000,
          //   messages : [
          //     {
          //       // address,
          //       // amount : '100000000', // 0.01 ton, 10 ** 10
          //       // stateInit : res.stateInit
          //
          //       // address,
          //       // amount : '100000000', // 0.01 ton, 10 ** 10
          //       // stateInit : res.stateInit
          //
          //       to : nftCollectionAddress.toString( true, true, true ),
          //       value : amount.toString(),
          //       data : bodyBase64,
          //       dataType : 'boc'
          //     }
          //   ]
          // }
          // console.log( 'tx', {
          //   tx : { ...tx },
          //   params : { ...params }
          // } )

          // const hash = await sendTransaction( tx )

          // const provider = connector.provider
          //
          // console.log( 'provider', provider )
          // window.ton.send(
          //   'ton_sendTransaction',
          //   [
          //     {
          //       to : nftCollectionAddress.toString( true, true, true ),
          //       value : amount.toString(),
          //       data : bodyBase64,
          //       dataType : 'boc'
          //     }
          //   ]
          // )

          setTimeout( () => {
            this.$store.dispatch( 'walletList/mintHandle', {
              status : 3 // 0 未开始 1 提交mint ， 2 mint 中， 3 成功 4 失败
            } )
            // resolve( hash )
          }, 1000 * 5 )
        } catch ( e ) {
          this.$store.dispatch( 'walletList/mintHandle', {
            status : 4
          } )
          // throw e
          reject( e )
        }
      } )
    },

    logout() {
      // pointLoginOut()
      this.$store.dispatch( 'user/LoginOut' )
      window.location.reload()
    },
    logoutTon() {
      connector.disconnect()
      this.$store.dispatch( 'walletList/resetWalletInfo' )

      clearStorage( 'ton_mintStatus' )
      clearStorage( 'ton_stakeStatus' )
      clearStorage( 'ton_unstakeStatus' )
      clearStorage( 'ton_mint_status' )
      clearStorage( 'ton_earned' )
      window.location.reload()
    },
    async showConnectQrcode() {
      try {
        // const result = await this.$ConnectTon.setWalletList()
        const result = await getWalletList()
        const { walletsList, embeddedWallet } = result
        this.$store.dispatch( 'walletList/setWalletList', {
          walletsList,
          embeddedWallet
        } )

        // 检测是否为嵌入式钱包
        if ( embeddedWallet ) {
          // await this.$ConnectTon.connectByBridgeKey( embeddedWallet.jsBridgeKey )
        } else {
          const params = {
            universalLink : walletsList[0].universalLink,
            bridgeUrl : walletsList[0].bridgeUrl
          }
          const options = {
            universalLink : params.universalLink,
            bridgeUrl : params.bridgeUrl
          }
          const universalLink = await connector.connect( options )
          // console.log( '2 打开弹框 universalLink:', universalLink )
          // console.log( '2 打开弹框 connector:', connector )
          this.dialog.universalLink = universalLink
          this.dialog.visible = true
        }

        const unsubscribe = connector.onStatusChange(
          walletInfo => {
            this.wallet = walletInfo
            this.formatAddress( walletInfo, connector )
            // this.$store.dispatch( 'walletList/setWalletInfo', {
            //   walletInfo,
            //   connector
            // } )

            this.dialog.visible = false
            this.dialog.visible = false
          },
          ( error ) => {
            console.log( 'onStatusChange Error:', error )
            this.$store.dispatch( 'walletList/setWalletInfo', {
              walletInfo : undefined,
              connector : undefined,
              originAddress : '',
              encryptionAddress : ''
            } )
          }
        )
      } catch ( error ) {
        console.log( 'showConnectQrcode error:', error )
        this.dialog.universalLink = ''
        this.dialog.visible = false
      }
    },
    async formatAddress( walletInfo, connector ) {
      try {
        const { address, chain } = walletInfo.account
        const { originAddress, encryptionAddress } = useSlicedAddress( address, chain )
        this.dialog.originAddress = originAddress
        this.dialog.encryptionAddress = encryptionAddress

        console.log( 'formatAddress 钱包链接成功:', {
          originAddress,
          encryptionAddress,
          walletInfo,
          connector
        } )

        this.$store.dispatch( 'walletList/setWalletInfo', {
          originAddress,
          encryptionAddress,
          walletInfo,
          connector
        } )

        // const walletAddress = connector.wallet.account.address || address
        const res = getAddressAndStateInit( address )
        console.log( 'getAddressAndStateInit', res )

        // const tx = {
        //   validUntil : Date.now() + 1000000,
        //   messages : [
        //     {
        //       address,
        //       amount : '100000000', // 0.01 ton, 10 ** 10
        //       stateInit : res.stateInit
        //     }
        //   ]
        // }
        // const hash = await sendTransaction( tx )
        // console.log( 'hash', hash )

        // const tx = {
        //   validUntil : Date.now() + 1000000,
        //   messages : [
        //     {
        //       address,
        //       amount : '100000000', // 0.01 ton, 10 ** 10
        //       // 要添加到事务的特定于合约的数据
        //       stateInit : res.stateInit
        //     }
        //   ]
        // }
        // this.dialog.tx = tx
        // console.log( 'tx', tx )
        // // this.dialog.sendTo = ''
        //
        // const hash = connector.sendTransaction( tx )
        // console.log( '1 hash', hash )
        // return tx
      } catch ( error ) {
        this.dialog.tx = null
        this.dialog.sendTo = ''
        this.dialog.originAddress = ''
        this.dialog.encryptionAddress = ''
      }
    },
    beforeCloseDialog( done ) {
      this.dialog.universalLink = ''
      done()
    },
    // *********------------TODO  原来逻辑----------------
    // tg 授权登录
    async loginByTg() {
      // pointTgLogin()
      this.loginByTelegram()
    },
    // tg 登录 成功后的回调
    async tgLoginSuccess() {
      if ( !this.tgLoginInfo.id ) {
        this.$message.error( this.$t( 'home.errMsg5' ) )
        return
      }
      const tg_user_id = this.tgLoginInfo.id
      try {
        const res = await this.$store.dispatch( 'user/handleLoginByTid', {
          device : this.browserId,
          version : '1.0.0',
          tg_user_id
        } )

        const { token, newer, user } = res
        const {
          first_name, last_name, id, photo_url, username, auth_date
        } = this.tgLoginInfo
        // const tgFullName = first_name ?
        let tgFullName
        if ( first_name && last_name ) {
          tgFullName = first_name + last_name
        } else if ( first_name && !last_name ) {
          tgFullName = first_name
        } else if ( !first_name && last_name ) {
          tgFullName = last_name
        } else {
          tgFullName = id
        }

        const avatar = photo_url || defaultAvatar
        // if ( id == '2049499263' ) {
        //   avatar = avatar1
        // }

        const result = {
          ...user,
          avatar,
          username,
          tgFullName,
          tg_uid : id,
          auth_date,
          newer,
          token
        }
        this.$store.dispatch( 'user/updateUserInfo', result )

        console.log( 'tgLoginInfo:', { ...this.tgLoginInfo } )
        console.log( 'tg登录成功res:', res )
        if ( res.token ) {
          // this.$message.success( this.$t( 'home.loginSuccess' ) )
        }
      } catch ( e ) {
        this.$message.error( this.$t( 'home.loginFail' ) )
      } finally {
        this.requestEnd = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-section {
  /deep/ .van-dialog {
    width: 420px;
  }
  .dialog-title {

  }
  .dialog-box {
    .sub-tt, .foot {
      font-size: 14px;
      line-height: 20px;
      color: #8794a1;
      margin: 2px 20px 20px;
      text-align: center;
    }
    .qrcode {
      position: relative;
      width: 300px;
      min-height: 300px;
      border-radius: 18px;
      background-color: #fff;
      margin: 20px auto;
      cursor: default;
      transition: 0.36s ease all;
      box-sizing: border-box;
      text-align: center;
      overflow: hidden;
      //box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border : 1px solid #dcdfe6;
      /deep/ .QRCode {
        margin: 10px auto;
      }
    }
    .foot {

    }
  }
}

//----------------------
.nav-bar-box {
  height: calc( 132px * 0.53 );
  background: #151E2D;
  .mask {
    height: 100%;
    //padding: 0 69px 0 82px;
    padding: 0 calc( 69px * 0.53 ) 0 calc( 82px * 0.53 );
    position: relative;
  }
  .logo {
    cursor: pointer;
    padding-top: calc( 28px * 0.53 );
    .svg-icon {
      width: calc( 76px * 0.53 );
      height: calc( 76px * 0.53 );
      margin-right: calc( 20px * 0.53 );
      vertical-align: middle;
    }
    .name {
      display: inline-block;
      font-size: calc( 40px * 0.53 );
      font-family: Helvetica Neue-Light, Helvetica Neue;
      font-weight: 300;
      color: #fff;
      line-height: calc( 76px * 0.53 );
      vertical-align: middle;
      letter-spacing: 2px;
    }
  }
  .right-menu {
    padding-top: calc( 35px * 0.53 );
    .lg-btn {
      width: calc( 286px * 0.53 );
      height: calc( 62px * 0.53 );
      line-height: calc( 62px * 0.53 );
      border-radius: calc( 62px * 0.53 );
      font-size: calc( 20px * 0.53 );
      padding: 0;
      text-align: center;
      font-family: Helvetica Neue-Medium, Helvetica Neue, syMedium;
      color: #FFF;
      background: #334358;
      border : 1px solid #334358;
      display: inline-block;
      vertical-align: middle;
      &:hover {
        background: #546883;
        border-color: #546883;
      }
      &:active {
        background: #1A2C43;
        border-color: #1A2C43;
      }
      .svg-icon {
        width: calc( 31px * 0.53 );
        height: calc( 27px * 0.53 );
        margin-right: calc( 18px * 0.53 );
        color: #fff;
        position: relative;
        top: 3px;
        top: 0;
      }
      &.ton {
        background: #1A96D6;
        border : 1px solid #1A96D6;
        &:hover {
          background: #3CB3F0;
          border-color: #3CB3F0;
        }
        &:active {
          background: #167EB4;
          border-color: #167EB4;
        }
      }
    }
    .userinfo {
      width: calc( 286px * 0.53 );
      height: calc( 62px * 0.53 );
      line-height: calc( 62px * 0.53 );
      padding: 0 calc( 20px * 0.53 );
      font-size: calc( 20px * 0.53 );
      border-radius: calc( 62px * 0.53 );
      margin: 0 calc( 10px * 0.53 );

      text-align: center;
      box-sizing: border-box;
      font-family: Helvetica Neue-Medium, Helvetica Neue, syMedium;
      color: #FFF;
      background: #334358;
      border : 1px solid #334358;
      display: inline-block;
      vertical-align: middle;
      &.tg {
        &:hover {
          background: #546883;
          border-color: #546883;
        }
        &:active {
          background: #1A2C43;
          border-color: #1A2C43;
        }
      }
      &.ton {
        background: #1A96D6;
        border : 1px solid #1A96D6;
        &:hover {
          background: #3CB3F0;
          border-color: #3CB3F0;
        }
        &:active {
          background: #167EB4;
          border-color: #167EB4;
        }
      }
    }
  }
}
.userinfo-container {
  width: 100%;
  .userinfo-wrapper {
    cursor: pointer;
    padding-top: calc( 10px * 0.53 );
    height: calc( 62px * 0.53 );
    position: relative;
    width: 100%;
    .user-avatar {
      display: inline-block;
      width: calc( 42px * 0.53 );
      height: calc( 42px * 0.53 );
      margin-right: calc( 14px * 0.53 );
      border-radius: 50%;
      overflow: hidden;
      float: left;
      img {
        width: 100%;
        height: 100%;
      }
      .svg-icon {
        width: calc( 31px * 0.53 );
        height: calc( 31px * 0.53 );
        position: relative;
        top: -4px;
        color: #fff;
      }
    }
    .username {
      float: left;
      display: inline-block;
      width: calc( 158px * 0.53 );
      height: calc( 42px * 0.53 );
      line-height: calc( 42px * 0.53 );
      font-size: calc( 20px * 0.53 );
      font-family: Helvetica Neue-Medium, Helvetica Neue, syMedium;
      font-weight: 500;
      color: #fff;
      margin: 0;
      padding: 0;
      text-align: left;
    }
    .el-icon-arrow-down {
      color: #fff;
      top: -15px;
      font-size: calc( 20px * 0.53 );
      position: relative;
      float: right;
    }
  }
}
</style>

<style lang="scss">
.el-dropdown-menu {
  //&.el-dropdown-menu--medium{
  &.nav-drop-menu{
    padding: 0;
    border : none;
    //transform: translateX(20px);
    //transform: translateX( calc( 20px * 0.53 ) );
    transform: translate( calc( 20px * 0.53 ), -15px );
    background: transparent;
    .popper__arrow{
      display: none;
    }
    .el-dropdown-menu__item {
      text-align: center;
      background: #334358;
      width: calc( 286px * 0.53 );
      &.item3{
        //height: 62px;
        //line-height: 62px;
        //border-radius: 15px;
        //padding: 0 31px;
        //font-size: 20px;
        height: calc( 62px * 0.53 );
        line-height: calc( 62px * 0.53 );
        border-radius: calc( 15px * 0.53 );
        padding: 0 calc( 31px * 0.53 );
        font-size: calc( 20px * 0.53 );

        background: #334358;
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
      .user-avatar {
        display: inline-block;
        //width: 64px;
        //height: 64px;
        //margin: 0 0 12px;
        width: calc( 64px * 0.53 );
        height: calc( 64px * 0.53 );
        margin: 0 0 calc( 12px * 0.53 );

        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .username {
        box-sizing: content-box;
        margin: 0;

        //padding: 0 0 12px;
        //width: 94px;
        //height: 23px;
        //font-size: 16px;
        //line-height: 19px;
        //
        padding: 0 0  calc( 12px * 0.53 );
        width:  calc( 94px * 0.53 );
        height:  calc( 23px * 0.53 );
        font-size:  calc( 16px * 0.53 );
        line-height:  calc( 19px * 0.53 );

        font-family: syBold, Noto Sans SC;
        font-weight: bold;
        color: #fff;

      }
      .out-btn {
        //width: 76px;
        //height: 36px;
        //line-height: 36px;
        //font-size: 14px;

        width: calc( 76px * 0.53 );
        height: calc( 36px * 0.53 );
        line-height: calc( 36px * 0.53 );
        font-size: 14px;
        background: transparent;

        font-weight: 500;
        color: #02ABFF;
        border : 1px solid #02ABFF;
        padding: 0;
        text-align: center;
      }
    }
    &.ton {
      transform: translate( calc( 20px * 0.53 ), -6px );
    }
  }

}
</style>

