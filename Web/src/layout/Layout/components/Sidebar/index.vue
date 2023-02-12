<template>
  <div class="sidebar-section">
    <el-menu
      class="base-sider-menu"
      :default-active="activeMenu"
      :collapse="isCollapse"
      :unique-opened="true"
      :collapse-transition="false"
      mode="vertical"
    >
      <el-menu-item index="0" class="toggle-bar-open" @click="toggleShowBar">
        <div class="iconTit">
          <svg-icon class-name="icon" icon-class="open" />
          <span slot="title">管理中心</span>
        </div>
      </el-menu-item>
      <sidebar-item
        v-for="route in permission_routes"
        :key="route.name + '_' + route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components : { SidebarItem },
  computed : {
    ...mapGetters( [
      'sidebar', 'permission_routes'
    ] ),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if ( meta.activeMenu ) {
        return meta.activeMenu
      }
      return path
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods : {
    toggleShowBar() {
      this.$store.dispatch( 'app/toggleSideBar' )
    }
  }
}
</script>

<style lang="scss">
.el-menu {
  &.base-sider-menu {
    border: none;
    .iconTit{
      display: flex;
      align-items: center;
      .icon{
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
    }
    .menu-wrapper{
      display: flex;
      align-items: center;
      a{
        display: inline-block;
        width: 100%;
      }
      .el-menu-item {
        display: flex;
        align-items: center;
        .svg-icon{
          width: 20px;
          height: 20px;
        }
      }
    }
    .nest-menu{
      .el-menu-item{
        padding-left: 51px !important;
      }
    }
    & > li:nth-child(1){
      display: flex;
    }
  }
}
.openSidebar {
  .menu-wrapper {
    .svg-icon {
      display: inline-block;
      margin-right: 10px;
      width: 20px;
      height: 20px;
    }
  }
}

#app .hideSidebar .base-sider-menu .el-submenu>.el-submenu__title .svg-icon {
  margin-left: 0;
}

.el-menu--vertical .nest-menu .el-submenu>.el-submenu__title:hover, .el-menu--vertical .el-menu-item:hover {
  background-color: #ecf5ff !important;
  color: #1890ff;
}
.el-submenu>.el-submenu__title{
  display: flex;
  align-items: center;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

</style>
<style lang="scss" scoped>
.base-sider-menu {
  position: relative;
  min-height : calc(100vh - 60px);
}
</style>
