import store from '@/store'

const { body } = document
const WIDTH = 768

export default {
  watch : {
    routerChange : {
      handler( res ) {

      },
      // immediate : true,
      deep : true
    }
  },
  computed : {
    routerChange() {
      const route = this.$route
      const device = this.device
      return {
        route,
        device
      }
    }
  },
  beforeMount() {
    window.addEventListener( 'resize', this.$_resizeHandler )
  },
  beforeDestroy() {
    window.removeEventListener( 'resize', this.$_resizeHandler )
  },
  mounted() {
    const isMobile = this.$_isMobile()
    if ( isMobile ) {
      store.dispatch( 'app/toggleDevice', 'mobile' )
      store.dispatch( 'app/closeSideBar', { withoutAnimation : true } )
    }
  },
  methods : {
    $_isMobile() {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },
    $_resizeHandler() {
      if ( !document.hidden ) {
        const isMobile = this.$_isMobile()
        store.dispatch( 'app/toggleDevice', isMobile ? 'mobile' : 'desktop' )

        if ( isMobile ) {
          store.dispatch( 'app/closeSideBar', { withoutAnimation : true } )
        }
      }
    }
  }
}
