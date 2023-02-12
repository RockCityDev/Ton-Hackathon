<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name : 'App',
  computed : {
    ...mapGetters( [
      'device',
      'walletConnector'
    ] )
  },
  data() {
    return {
      onLine : navigator.onLine,
      show : true
    }
  },
  watch : {
    onLine : {
      handler( status ) {
        if ( !status ) {
          this.$alert( '请检查您的网络是否可用', '错误', {
            confirmButtonText : '确定',
            showClose : false
          } )
        }
      },
      immediate : true,
      deep : true
    }
  },
  created() {

  },
  mounted() {
    const self = this
    window.addEventListener( 'online', self.updateOnlineStatus )
    window.addEventListener( 'offline', self.updateOnlineStatus )
  },
  beforeDestroy() {
    const self = this
    window.removeEventListener( 'online', self.updateOnlineStatus )
    window.removeEventListener( 'offline', self.updateOnlineStatus )
  },
  methods : {
    updateOnlineStatus( e ) {
      const { type } = e
      this.onLine = type === 'online'
    }
  }
}
</script>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .v-note-help-wrapper {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 9999 !important;
    -webkit-transition: all 0.1s linear 0s;
    transition: all 0.1s linear 0s;
  }
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
