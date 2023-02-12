
<template>
  <div class="has-logo clearfix">
    <div class="fl logo" @click="goHome">
      <!--<img :src="require( '@/assets/imgs/logo-group.png')" alt=""/>-->
      <span>GroupSpace</span>
    </div>

    <div class="fr">
      <el-button
        v-if="!accessToken"
        round
        class="connect-btn"
        @click="loginByWallet"
      >
        <svg-icon :icon-class="icon" />
        connect wallet
      </el-button>

      <div v-else class="login-info">
        <div class="username ellipsis">
          <el-tooltip
            class="item"
            effect="dark"
            :content="username"
            placement="left"
          >
            <span>{{ username | formatUsername }}</span>
          </el-tooltip>

          <span
            v-clipboard:copy="username"
            v-clipboard:success="clipboardSuccess"
            v-clipboard:error="clipboardError"
            class="icon"
          >
            <svg-icon icon-class="copy" />
          </span>
        </div>

        <div class="avatar" @click="goUserPortal">
          <img :src="avatar" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name : 'Head',
  props : {
    icon : {
      type : String,
      default : 'line_wallet'
    },
    btnTxt : {
      type : String,
      default : 'connect wallet'
    }
  },
  computed : {
    ...mapGetters( [
      'username',
      'avatar',
      'accessToken'
      // 'loginStatus',
      // 'avatarIndex',
      // 'wallet_address'
    ] )
  },
  methods : {
    goHome() {
      this.$router.push( '/' )
    },
    clipboardSuccess() {
      this.$notify( {
        title : '提示',
        message : '复制成功',
        type : 'success'
      } )
    },
    clipboardError() {
      this.$message.error( '复制失败,请稍后再试' )
    },
    goUserPortal() {
      if ( this.accessToken ) {
        this.$router.push( '/user' )
      }
    },
    loginByWallet() {
      this.$store.dispatch( 'wallet/toggleLoginPopup', 2 )
    }
  }
}
</script>

<style lang="scss" scoped>
.connect-btn {
  position: relative;
  width: 185px;
  height: 36px;
  line-height: 36px;
  padding-top: 0;
  padding-bottom: 0;
  text-align: center;
  border : none;
  background: #02ABFF;
  color: #fff;
  vertical-align: middle;
  .svg-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    color: #02ABFF;
    vertical-align: middle;
  }
}

.has-logo {
  height: 60px;
  padding-top: 12px;
  background: #fff;
  //webkit-backdrop-filter: saturate(180%) blur(20px);
  //backdrop-filter: saturate(180%) blur(20px);
  //background-color: rgba(255,255,255,0.72);

  .logo {
    vertical-align: middle;
    padding-top: 6px;
    cursor: pointer;
    img {
      vertical-align: top;
      width: 24px;
      height: 24px;
      margin-right: 8px;
      display: inline-block;
    }
    span {
      font-size: 18px;
      line-height: 21px;
      vertical-align: top;
      color: #000;
      font-weight: bold;
      display: inline-block;
      font-family: Roboto;
    }
  }
}

.login-info {
  display: inline-block;
  .username {
    padding: 0 12px;
    height: 28px;
    line-height: 28px;
    background: #F0F1F4;
    border-radius : 28px;
    text-align: center;
    color: #000;
    margin-right: 8px;
    display: inline-block;
    vertical-align: middle;
    .icon {
      cursor: pointer;
      display: inline-block;
    }
    .svg-icon {
      color :#4C4C52;
    }
  }
  .avatar {
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
