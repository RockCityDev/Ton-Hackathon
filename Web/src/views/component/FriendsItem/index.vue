
<template>
  <div class="list clearFix">
    <div class="avatar fl">
      <img :src="detail.avatar || defaultAvatar" alt="">
    </div>
    <div class="fl info">
      <div class="name ellipsis">
        {{ detail.name }}
      </div>
      <div class="address ellipsis">
        {{ detail.address }}
      </div>
    </div>

  </div>
</template>

<script>
const defaultAvatar = require( '@/assets/imgs/default_avatar.png' )

export default {
  name : 'FriendsItem',
  props : {
    detail : {
      type : Object,
      default() {
        return {
          avatar : '',
          name : '',
          addres : ''
        }
      }
    }

  },
  data() {
    return {
      defaultAvatar
    }
  },
  created() {
    this.loading = true
  },
  mounted() {

  },
  methods : {

  }
}
</script>

<style lang="scss" scoped>
.list {
  width: 100%;
  margin-bottom: 32px;
  margin-bottom: calc( 34px * 0.53 );
  .avatar {
    //width: 76px;
    //height: 76px;
    //border-radius: 76px;
    //margin-right: 20px;

    width: calc( 84px * 0.53 );
    height: calc( 84px * 0.53 );
    border-radius: calc( 84px * 0.53 );
    margin-right: calc( 20px * 0.53 );

    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .info {
    //width: calc(100% - 76px - 21px);
    width: calc(100% - 105px * 0.53 );
  }
  .name {
    //height: 44px;
    //line-height: 44px;
    //font-size: 32px;

    height: calc( 48px * 0.53 );
    line-height: calc( 48px * 0.53 );
    font-size: calc( 36px * 0.53 );

    font-family: Roboto-Medium, Roboto, syMedium;
    font-weight: 500;
    color: #fff;
    margin-bottom: 1px;
  }
  .address {
    //height: 34px;
    //line-height: 34px;
    //font-size: 24px;

    height: calc( 37px * 0.53 );
    line-height: calc( 37px * 0.53 );
    font-size:calc( 27px * 0.53 );
    font-family: Poppins-Regular, Poppins, syRegular;
    font-weight: 400;
    color: #7E7E82;
  }
}
</style>
