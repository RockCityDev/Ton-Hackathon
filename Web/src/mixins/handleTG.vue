<script>
import { mapGetters } from 'vuex'
import { initUrl } from '@/utils/init'

export default {
  name : 'HandleTG',
  data() {
    return {
      tgParams : {
        bot_id : '',
        // bot_id : '5620129690:AAHojopbZnG-Ogb-psls_LEBGebHLVOYpbc',
        // bot_id : '5781223029:AAG2fYZTI8XNSCsBFCfBaDV0keIphu-00zg',
        // bot_id : '5470526980:AAEUIqLq1u2sjBHOS7mMuEAn85yLk7UQpNw',
        request_access : 'write',
        embed : 1
      },
      tgInfo : {}
    }
  },
  computed : {
    ...mapGetters( [
      'tgLoginInfo',
      'tgLoginStatus'
    ] )
  },
  created() {
    const { botToken, botName } = initUrl()
    this.tgParams.bot_id = botToken
    this.addJs( {
      url : 'https://telegram.org/js/telegram-widget.js?21',
      botName
    } )
    this.$nextTick( () => {
      // 自动登录tg
      if ( this.tgLoginInfo && this.tgLoginInfo.auth_date ) {
        this.$store.dispatch( 'user/setTgLoginStatus', 3 )
      } else {
        this.$store.dispatch( 'user/setTgLoginStatus', 1 )
      }
    } )
  },
  methods : {
    addJs( { url, botName } ) {
      return new Promise( ( resolve, reject ) => {
        const script = document.createElement( 'script' )
        script.src = url
        script.type = 'text/javascript'
        script.async = true
        script.setAttribute( 'data-telegram-login', botName )
        script.setAttribute( 'data-size', 'large' )
        script.setAttribute( 'ata-request-access', 'write' )
        script.setAttribute( 'ata-onauth', 'onTelegramAuth(user)' )
        // 如果注入到body中，回报错提示 Username invalid
        document.head.appendChild( script )
        script.onload = () => {
          resolve()
        }
      } )
    },
    // 第三方授权登录
    loginByTelegram() {
      const params = {
        ...this.tgParams
      }
      this.$store.dispatch( 'user/setTgLoginStatus', 1 )
      if ( !window.Telegram ) {
        // '请检测您的 tg bot相关配置施是否正确'
        this.$message.error( this.$t( 'home.checkTgConfig' ) )
        this.$store.dispatch( 'user/setTgLoginStatus', 4 )
        return
      }
      this.$store.dispatch( 'user/setTgLoginStatus', 2 )
      window.Telegram.Login && window.Telegram.Login.auth( params, ( data ) => {
        if ( !data ) {
          this.loginError()
          return
        }
        this.loginSuccess( data )
      } )
    },
    loginSuccess( res ) {
      // 提交给服务器 并保存到本地
      this.$store.dispatch( 'user/setTgLoginInfo', res )
      this.$store.dispatch( 'user/setTgLoginStatus', 3 )
    },
    loginError() {
      this.$message.warning( '登录失败' )
      this.$store.dispatch( 'user/setTgLoginStatus', 4 )
    }
  }
}
</script>
