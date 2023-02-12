<template>
  <div :class="classObj" class="app-wrapper">
    <Navbar />
    <el-container class="base-main-container">
      <el-main class="el-main-wrapper">
        <app-main />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { Navbar, AppMain } from './components'
import { mapGetters } from 'vuex'
import { mapState } from 'vuex'

export default {
  name : 'Layout',
  components : {
    AppMain,
    Navbar
  },
  computed : {
    ...mapGetters( [
      'sidebar',
      'device'
    ] ),
    ...mapState( {
      device : state => state.app.device
    } ),
    classObj() {
      return {
        withoutAnimation : this.sidebar.withoutAnimation,
        mobile : this.device === 'mobile'
      }
    }
  },
  methods : {
    handleClickOutside() {
      // this.$store.dispatch( 'app/closeSideBar', { withoutAnimation : false } )
    }
  }
}
</script>

<!--fix：sticky 粘性布局失效-->
<style lang="scss" scoped>
.app-wrapper {
  height: auto;
  overflow: visible;
  min-width: 1920px;
  min-width: calc( 1920px * 0.53 );
}
.el-main-wrapper {
  padding: 0;
  // 防止van-list 重复加载load
  overflow: visible;
}
.base-main-container {
  background: #151E2D;
  //min-height: calc(100vh - 132px);
  min-height: calc(100vh - 132px * 0.53);
  position: relative;
  .bg-svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
