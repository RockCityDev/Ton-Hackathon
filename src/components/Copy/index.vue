<template>
  <span class="icons-container copy-icon inlineBlock" @click="handle($event)">
    <svg-icon icon-class="copy" class-name="icon" />
    <!-- <i class="el-icon-copy-document" /> -->
    <el-button type="text" class="copyBtn">复制</el-button>
  </span>
</template>

<script>
import clipboard from '@/utils/clipboard'

export default {
  name : 'Copy',
  props : {
    text : { type : String, default : window.location.href }
  },
  data() {
    return {}
  },
  methods : {
    async handle( event ) {
      clipboard( this.text, event )
    }
  }
}
</script>

<style lang="scss" scoped>
.copy-icon {
  margin-left: 5px;
  cursor: pointer;
  display: inline-block;
  width: 60px;
  height: 20px;
  vertical-align: sub;
  display: flex;
  justify-content: center;
  align-items: center;
  .icon {
    pointer-events: none;
    display: inline-block;
    width: 14px;
    height: 14px;
    color: #1890ff;
  }
  .copyBtn {
    color: rgba(75, 166, 255, 100);
    font-size: 14px;
    text-align: left;
    font-family: syRegular;
  }
}
</style>
