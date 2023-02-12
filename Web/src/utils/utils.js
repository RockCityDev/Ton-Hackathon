export function secondsToStr( temp ) {
  const years = Math.floor( temp / 31536000 )
  if ( years ) {
    return years + ' year' + numberEnding( years )
  }
  const days = Math.floor( ( temp %= 31536000 ) / 86400 )
  if ( days ) {
    return days + ' day' + numberEnding( days )
  }
  const hours = Math.floor( ( temp %= 86400 ) / 3600 )
  if ( hours ) {
    return hours + ' hour' + numberEnding( hours )
  }
  const minutes = Math.floor( ( temp %= 3600 ) / 60 )
  if ( minutes ) {
    return minutes + ' minute' + numberEnding( minutes )
  }
  const seconds = temp % 60
  return seconds + ' second' + numberEnding( seconds )
  function numberEnding( number ) {
    return ( number > 1 ) ? 's' : ''
  }
}

export function kebabCase( s ) {
  return s.replace( /[A-Z]/g, ( m ) => `-${m.toLowerCase()}` )
}

//  获取文件大小
export function getFileSizes( size ) {
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
/**
 * @param {转换时间} time
 */
export function getTime( time ) {
  if ( time ) {
    var date = new Date( time * 1000 )
    var y = date.getFullYear()
    var m = ( date.getMonth() + 1 < 10 ? '0' + ( date.getMonth() + 1 ) : date.getMonth() + 1 )
    var d = ( date.getDate() < 10 ? '0' + ( date.getDate() ) : date.getDate() )
    return y + '-' + m + '-' + d
  } else {
    return ''
  }
}
/**
 *
 * @param {转换金额} money
 */
export function switchMoney( money ) {
  return money.toFixed( 2 )
}
