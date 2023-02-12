<template>
  <div :class="classObj" class="app-wrapper">
    <Navbar />
    <el-container class="base-main-container">
      <el-aside
        class="base-aside"
        :class="[isCollapse ? 'is-open' : 'is-close']"
        :width="isCollapse ? '63px' : '200px'"
      >
        <div class="sider-bar">
          <sidebar />
        </div>
      </el-aside>
      <el-main>
        <app-main />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { Navbar, AppMain, Sidebar } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState, mapGetters } from 'vuex'

export default {
  name : 'Layout',
  components : {
    AppMain,
    Navbar,
    Sidebar
  },
  mixins : [ResizeMixin],
  computed : {
    ...mapGetters( [
      'sidebar',
      'device'
    ] ),
    ...mapState( {
      sidebar : state => state.app.sidebar,
      device : state => state.app.device,
      showSettings : state => state.settings.showSettings,
      needTagsView : state => state.settings.tagsView,
      fixedHeader : state => state.settings.fixedHeader
    } ),
    classObj() {
      return {
        hideSidebar : !this.sidebar.opened,
        openSidebar : this.sidebar.opened,
        withoutAnimation : this.sidebar.withoutAnimation,
        mobile : this.device === 'mobile'
      }
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if ( meta.activeMenu ) {
        return meta.activeMenu
      }
      return path
    }
  }
}
</script>

<style lang="scss" scoped>
.base-main-container {
  .base-aside {
    padding: 0;
    background: #fff;
    border-right: solid 1px #e6e6e6;
    box-sizing: border-box;
    min-height: calc(100vh - 132px * 0.53 );
    overflow: hidden;
    margin-bottom: 0;
  }
}

.app-wrapper {
  //overflow: auto;
  //height: 100%;
  height: auto;
  overflow: visible;
}
</style>
