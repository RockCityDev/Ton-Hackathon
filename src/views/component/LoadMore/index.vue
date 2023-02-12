
<template>
  <el-button class="load-more" @click="loadMore">
    View More
  </el-button>
</template>

<script>

export default {
  name : 'LoadMore',
  data() {
    return {

    }
  },
  mounted() {

  },
  methods : {
    loadMore() {
      this.$emit( 'loadMore' )
    }
  }
}
</script>

<style lang="scss" scoped>
.load-more {
  //width: 780px;
  //height: 80px;
  //line-height: 80px;
  //border-radius: 18px;
  //font-size: 27px;

  //width: calc( 686px * 0.53 );
  width: calc( 870px * 0.53 );
  height: calc( 90px * 0.53 );
  line-height: calc( 90px * 0.53 );
  border-radius: calc( 20px * 0.53 );
  font-size: calc( 30px * 0.53 );

  padding: 0;
  margin: 0;
  font-family: Roboto-Medium, Roboto, syMedium;
  font-weight: 500;
  color: #fff;
  text-align: center;
  background: #151E2D;
  border: 1px solid #707070;
  &:hover {
    //background: #546883;
    //border-color: #546883;
  }
  &:active {
    background: #707070;
    border-color: #707070;
  }
}
</style>
