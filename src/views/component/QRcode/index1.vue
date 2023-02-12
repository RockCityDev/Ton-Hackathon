<template>
  <div class="QRCode" :style="{'width':width, 'height':height}">
    <span ref="qr" />
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
export default {
  name : 'QRCode',
  props : {
    content : {
      type : String,
      default : '测试二维码'
    },
    width : {
      type : String,
      default : '100'
    },
    height : {
      type : String,
      default : '100'
    },
    codeName : {
      type : String,
      default : '二维码'
    },
    load : {
      type : Boolean,
      default : true
    },
    view : {
      type : Boolean,
      default : true
    }
  },
  data() {
    return {
      qrcode : null
    }
  },
  computed : {},
  watch : {
    content( val ) {
      // console.log( '1 val', this.qrcode, val )
      this.clear()
      this.init()
    }
  },
  created() {
    this.$nextTick( () => {
      this.init()
    } )
  },
  mounted : function() {},
  methods : {
    init() {
      const el = this.$refs.qr
      const width = this.width
      const height = this.height
      const qrcode = new QRCode( el, {
        text : this.content,
        width,
        height,
        colorDark : 'black',
        colorLight : 'white'
      } )
      this.qrcode = qrcode
    },
    clear() {
      this.qrcode && this.qrcode.clear()
      const el = this.$refs.qr
      if ( el ) {
        el.innerHTML = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.QRCode {
  display: inline-block;
  position: relative;
  overflow: hidden;
  .QQMode {
    position: absolute;
    left: 0;
    bottom: 100%;
    right: 0;
    height: 0;
    background-color: rgba(0, 0, 0, 0.45);
    transition: all 200ms ease-in-out;
    cursor: pointer;
    color: #fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 20px;
    font-weight: bolder;
    box-sizing: border-box;
    padding: 10px;
    span {
      display: inline-block;
    }
  }
}
.QRCode:hover .QQMode {
  bottom: 0;
  height: 100%;
}
</style>
