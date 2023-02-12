// import parseTime, formatTime and set to filter
export { parseTime, formatTime, formatSeconds } from '@/utils'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize( time, label ) {
  if ( time === 1 ) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo( time ) {
  const between = Date.now() / 1000 - Number( time )
  if ( between < 3600 ) {
    return pluralize( ~~( between / 60 ), ' minute' )
  } else if ( between < 86400 ) {
    return pluralize( ~~( between / 3600 ), ' hour' )
  } else {
    return pluralize( ~~( between / 86400 ), ' day' )
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter( num, digits ) {
  const si = [
    { value : 1E18, symbol : 'E' },
    { value : 1E15, symbol : 'P' },
    { value : 1E12, symbol : 'T' },
    { value : 1E9, symbol : 'G' },
    { value : 1E6, symbol : 'M' },
    { value : 1E3, symbol : 'k' }
  ]
  for ( let i = 0; i < si.length; i++ ) {
    if ( num >= si[i].value ) {
      return ( num / si[i].value ).toFixed( digits ).replace( /\.0+$|(\.[0-9]*[1-9])0+$/, '$1' ) + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter( num ) {
  return ( +num || 0 ).toString().replace( /^-?\d+/g, m => m.replace( /(?=(?!\b)(\d{3})+$)/g, ',' ) )
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst( string ) {
  return string.charAt( 0 ).toUpperCase() + string.slice( 1 )
}

export function autoTOUpperCase( value ) {
  if ( !value ) return ''
  value = value.toString()
  return value.toUpperCase()
}
// 根据参数截取字符串
export function subStringStr( value, len ) {
  if ( !value ) return ''
  return ( value.length > len ? value.substring( 0, len ) + '...' : value )
}
//  获取文件大小
export function getFileSize( size ) {
  let num
  const size1 = size / 1024
  if ( size1 >= 512000 ) {
    num = ( size1 / 1024 / 1024 ).toFixed( 1 ) + 'GB'
  } else if ( size1 >= 500 && size1 <= 512000 ) {
    num = ( size1 / 1024 ).toFixed( 1 ) + 'MB'
  } else {
    num = size1.toFixed( 1 ) + 'KB'
  }
  return num
}
//  获取文件大小
export function getDateStr( date ) {
  const data = date.split( ' ' )
  return data.length > 0 ? data[0] : date
}
// 容量单位转换 单位 kb
export function kbToG( limit ) {
  const gb = Math.floor( limit / 1024 / 1024 )
  const mb = Math.floor( limit / 1024 % 1024 )
  const kb = Math.floor( limit % 1024 )
  let size = ''
  if ( gb != '0' ) size += `${gb}GB`
  if ( mb != '0' ) size += `${mb}MB`
  if ( kb != '0' ) size += `${kb}KB`
  return size
}

// 把时间戳（单位秒 转为 年-月-日 时:分:秒
export function changeTime( str ) {
  if ( !str ) {
    return '未发布'
  }
  var time = new Date( str * 1000 )
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  return y + '-' + add0( m ) + '-' + add0( d )
}
export function changeTimeHMS( str ) {
  if ( !str ) return '--'
  var time = new Date( str * 1000 )
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  var h = time.getHours()
  var mm = time.getMinutes()
  var s = time.getSeconds()
  return y + '-' + add0( m ) + '-' + add0( d ) + ' ' + add0( h ) + ':' + add0( mm ) + ':' + add0( s )
}
export function changeTimeHM( str ) {
  if ( !str ) return '--'
  var time = new Date( str * 1000 )
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  var h = time.getHours()
  var mm = time.getMinutes()
  return y + '-' + add0( m ) + '-' + add0( d ) + ' ' + add0( h ) + ':' + add0( mm )
}
export function add0( m ) { return m < 10 ? '0' + m : m }

// 将时间戳格式转换为 今天 昨天 还是实际时间
export function formatUnixToDayTime( date ) {
  var res = date * 1000
  const tt = new Date( parseInt( res ) )
  const days = parseInt( ( new Date().getTime() - res ) / 86400000 )
  const today = new Date().getDate()
  const day = tt.getDate()
  let result
  const offset = Math.abs( today - day )
  if ( days < 4 && offset < 4 ) {
    if ( offset === 0 ) {
      // result = "今天" + time + ":" + min;
      result = '今天'
    } else if ( offset === 1 ) {
      result = '昨天'
    } else if ( offset === 2 ) {
      result = changeTime( date )
    }
  } else {
    result = changeTime( date )
  }
  return result
}
/**
 * URL补全
 * @params path[String]
 * @return String[url]
 *
 * */
export function addProtocol( path = '' ) {
  const protocol = window.location.href.startsWith( 'https://' ) ? 'https://' : 'http://'
  if ( !path.startsWith( 'https://' ) && !path.startsWith( 'http://' ) ) {
    return protocol + path
  } else {
    return path
  }
}

export function changeAmount( amount, unit ) {
  // return ( amount * 0.001 ).toFixed( 2 ) + ' ETH'
  // return ( amount ).toFixed( 2 ) + ' ETH'
  return amount + ' ETH'
}

// 切换时间格式  年-月-日 时:分：秒 ==> 月-日 时:分 2020-01-01 01:01
export function switchTime( time ) {
  if ( !time ) return ''
  const len = time.length
  if ( len < 19 ) return time
  return time.slice( 5, len - 3 )
}

// 保留n位小数并格式化输出（不足的部分补0）
export function formatFloat( value, n = 5 ) {
  if ( value < 0.00001 ) {
    return '< 0.00001'
  }
  const str = value + ''
  const index = str.indexOf( '.' )
  let result
  let float // 小数部分
  let left
  if ( index < 0 ) { // 整数
    result = value
  } else {
    float = str.substring( index + 1, index + 6 )
    left = str.substring( 0, index )
    result = left + '.' + float
  }
  return result
  // var f = Math.round( value * Math.pow( 10, n ) ) / Math.pow( 10, n )
  // var s = f.toString()
  // var rs = s.indexOf( '.' )
  //
  // console.log('f', {
  //   f,s,rs
  // })
  //
  // // 整数
  // if ( rs < 0 ) {
  //   s += '.'
  // } else {
  //
  // }
  // for ( var i = s.length - s.indexOf( '.' ); i <= n; i++ ) {
  //   s += '0'
  // }
  // return s
}
export function formatDollar( value, n = 5 ) {
  if ( value < 0.00001 ) {
    return '0'
  }
  const str = value + ''
  const index = str.indexOf( '.' )
  let result
  let float // 小数部分
  let left
  if ( index < 0 ) { // 整数
    result = value
  } else {
    float = str.substring( index + 1, index + 6 )
    left = str.substring( 0, index )
    result = left + '.' + float
  }
  return result
}

export function formatUsername( username, start = 4, end = 5 ) {
  if ( !username ) return ''
  const len = username.length
  if ( len <= 9 ) return username
  const prefix = username.slice( 0, start )
  const suffix = username.slice( len - end, len )
  return prefix + '...' + suffix
}

