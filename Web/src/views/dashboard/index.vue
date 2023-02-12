<template>
  <div class="dashboard-container p12">
    <el-tag type="info">主控台</el-tag>
  </div>
</template>

<script>
export default {
  name : 'Dashboard'
}
</script>

<style lang="scss" scoped>
  .dashboard-container {
    width: 100%;
    height: calc( 100vh - 90px );
    .content{
      width: 80%;
      margin: 0 auto;
      .bg{
        .svg-icon{
          width: 500px;
          height: 500px;
        }
      }
    }
  }
</style>
