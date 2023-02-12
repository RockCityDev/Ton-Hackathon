import Clipboard from './clipboard'
// 一键复制 于兵 添加

const install = function( Vue ) {
  Vue.directive( 'Clipboard', Clipboard )
}

if ( window.Vue ) {
  window.clipboard = Clipboard
  Vue.use(install); // eslint-disable-line
}

Clipboard.install = install
export default Clipboard
