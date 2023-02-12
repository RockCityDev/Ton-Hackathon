<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
      :small="small"
      :background="background"
      :page-size="pageSize"
      :total="total"
      :current-page.sync="currentPage"
      :layout="layout"
      :prev-text="prevText"
      :next-text="nextText"
      :page-sizes="pageSizes"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'

export default {
  name : 'Pagination',
  props : {
    prevText : {
      required : '',
      type : String
    },
    nextText : {
      required : '',
      type : String
    },
    total : {
      required : true,
      type : Number
    },
    page : {
      type : Number,
      default : 1
    },
    limit : {
      type : Number,
      default : 10
    },
    pageSizes : {
      type : Array,
      default() {
        return [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120]
      }
    },
    layout : {
      type : String,
      default : 'total, prev, pager, next, sizes, jumper'
    },
    background : {
      type : Boolean,
      default : true
    },
    small : {
      type : Boolean,
      default : false
    },
    autoScroll : {
      type : Boolean,
      default : true
    },
    hidden : {
      type : Boolean,
      default : false
    }
  },
  computed : {
    currentPage : {
      get() {
        return this.page
      },
      set( val ) {
        this.$emit( 'update:page', val )
      }
    },
    pageSize : {
      get() {
        return this.limit
      },
      set( val ) {
        this.$emit( 'update:limit', val )
      }
    }
  },
  methods : {
    handleSizeChange( val ) {
      this.$emit( 'pagination', { page : this.currentPage, limit : val } )
      if ( this.autoScroll ) {
        scrollTo( 0, 800 )
      }
    },
    handleCurrentChange( val ) {
      this.$emit( 'pagination', { page : val, limit : this.pageSize } )
      if ( this.autoScroll ) {
        scrollTo( 0, 800 )
      }
    }
  }
}
</script>

<style scoped>
  .pagination-container {
    background: #fff;
    padding: 32px 16px;
  }
  .pagination-container.hidden {
    display: none;
  }
</style>
