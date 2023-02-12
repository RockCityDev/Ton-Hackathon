<template>
  <div
    v-if="!item.hidden"
    class="menu-wrapper"
    :class="item.customClass || ''"
  >
    <template
      v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow"
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{'submenu-title-noDropdown':!isNest}"
        >
          <item
            :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>
      </app-link>
    </template>
    <el-submenu
      v-else
      ref="subMenu"
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <template slot="title">
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.title"
        />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name : 'SidebarItem',
  components : { Item, AppLink },
  mixins : [FixiOSBug],
  props : {
    item : {
      type : Object,
      required : true
    },
    isNest : {
      type : Boolean,
      default : false
    },
    basePath : {
      type : String,
      default : ''
    }
  },
  data() {
    this.onlyOneChild = null
    return {}
  },
  methods : {
    hasOneShowingChild( children = [], parent ) {
      const showingChildren = children.filter( item => {
        if ( item.hidden ) {
          return false
        } else {
          // 临时设置(如果只有一个显示的子节点，则使用临时设置)
          this.onlyOneChild = item
          return true
        }
      } )
      // 当只有一个子路由器时，默认显示子路由器
      if ( showingChildren.length === 1 ) {
        return true
      }
      // 如果没有要显示的子路由器，则显示父路由器
      if ( showingChildren.length === 0 ) {
        this.onlyOneChild = { ... parent, path : '', noShowingChildren : true }
        return true
      }

      return false
    },
    resolvePath( routePath ) {
      if ( isExternal( routePath ) ) {
        return routePath
      }
      if ( isExternal( this.basePath ) ) {
        return this.basePath
      }
      return path.resolve( this.basePath, routePath )
    },
    goToPath( payload ) {
      const { name } = payload
      this.$router.push( { name } )
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu-wrapper {
    &.bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
    }
    .el-submenu {
      width: 100%;
    }
  }
</style>
