<template>
  <el-drawer
    custom-class="login-popup-drawer"
    title="我是标题"
    :visible.sync="walletPopup"
    :with-header="false"
    :close-on-press-escape="false"
    :show-close="false"
    :wrapper-closable="true"
    :before-close="beforeCloseDrawer"
  >
    <!--    @closeDrawer="closeDrawer"-->
    <div class="login-popup">

      <div class="wallet-section-head">
        <div class="tt"> 链接你的数字钱包</div>
        <div class="desc"> 选择一个我们支持的数字货币钱包</div>
      </div>

      <div class="wallet-list">
        <div
          v-for="item in list"
          :key="item.id"
          class="wallet-item clearFix"
          @click="walletSelect( item )"
        >
          <div class="avatar fl">
            <img :src="item.avatar" alt="">
          </div>

          <div class="name ellipsis fl">
            {{ item.name }}
          </div>

          <div v-if="item.recommend" class="recommend fr">
            <a href="javascript:;"> 推荐 </a>
          </div>
        </div>
      </div>

      <div class="btn-group" @click="hideWalletList">
        <a href="javascript:;"> 取消 </a>
      </div>

    </div>
  </el-drawer>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name : 'LoginPopup',
  props : {
    show : {
      type : Boolean,
      default : false
    }
  },
  data() {
    return {
      walletPopup : true,
      list : [
        {
          id : 1,
          name : 'MetaMask',
          recommend : true,
          avatar : require( '@/assets/imgs/MetaMask.png' )
        }
        // {
        //   id : 2,
        //   name : 'Coinbase Wallet',
        //   recommend : false,
        //   avatar : require( '@/assets/imgs/coinmarketcap.png' )
        // },
        // {
        //   id : 3,
        //   name : 'Imtoken',
        //   recommend : false,
        //   avatar : require( '@/assets/imgs/imtoken.png' )
        // },
        // {
        //   id : 4,
        //   name : 'coingecko',
        //   recommend : false,
        //   avatar : require( '@/assets/imgs/coingecko.png' )
        // }
      ]
    }
  },
  computed : {
    ...mapGetters( [
      'openLogin'
    ] )
  },
  watch : {
    openLogin : {
      handler( res ) {
        this.walletPopup = res == 2
      },
      immediate : true,
      deep : true
    }
  },
  mounted() {

  },
  methods : {
    beforeCloseDrawer( done ) {
      this.hideWalletList()
      done()
    },
    closed() {
      this.$store.dispatch( 'wallet/toggleLoginPopup', 1 )
    },
    loginByWallet() {
      this.showWalletList()
    },
    showWalletList() {
      this.$emit( 'showWalletList' )
    },
    hideWalletList() {
      this.$emit( 'hideWalletList' )
      this.$store.dispatch( 'wallet/toggleLoginPopup', 1 )
    },
    async walletSelect( item ) {
      if ( !this.$support ) {
        this.$message.error( '当前设备不支持MateMask，请确保设备已经正确安装该钱包插件。' )
        return
      }
      try {
        const { id } = item
        if ( id != 1 ) {
          this.$message.warning( '目前仅开放了 metaMask钱包的相关功能' )
        } else {
          this.$store.dispatch( 'wallet/updateWalletPopupEvent', {
            click : true,
            name : 'metaMask'
          } )
        }
      } catch ( err ) {

      }
    }
  }
}
</script>

<style>
  .login-popup-drawer {
    background: #080017;
  }
</style>
<style scoped lang="scss">

  .login-popup {
    padding: 32px 24px;

    .wallet-section-head {
      margin-bottom: 16px;

      .tt {
        height: 19px;
        font-size: 16px;
        font-family: syBold, Noto Sans SC;
        font-weight: bold;
        color: #FFFFFF;
        line-height: 19px;
        margin-bottom: 6px;
      }

      .desc {
        height: 20px;
        font-size: 14px;
        font-family: syRegular, Noto Sans SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.5);
        line-height: 16px;
      }
    }

    .wallet-list {
      .wallet-item {
        cursor: pointer;
        height: 56px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.05);
        margin-bottom: 8px;
        border-radius: 8px;

        &:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .avatar {
          width: 32px;
          height: 32px;
          overflow: hidden;
          margin-right: 16px;

          img {
            display: inline-block;
            width: 100%;
            height: 100%;
          }
        }

        .name {
          height: 32px;
          font-size: 16px;
          font-family: syBold, SF Pro Text;
          font-weight: 600;
          color: #fff;
          line-height: 32px;
        }

        .recommend {
          a {
            cursor: default;
            display: inline-block;
            height: 32px;
            line-height: 32px;
            font-size: 14px;
            font-family: syMedium, Noto Sans SC;
            font-weight: 500;
            color: #02ABFF;
          }
        }
      }
    }

    .btn-group {
      margin-top: 28px;
      text-align: center;

      a {
        border-radius: 8px;
        display: block;
        height: 47px;
        line-height: 47px;
        font-size: 16px;
        font-family: syMedium;
        font-weight: 500;
        color: #02ABFF;
        letter-spacing: 2px;
        background: rgba(255, 255, 255, 0.05);

      }
    }
  }
</style>
