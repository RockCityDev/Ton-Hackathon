// 角色权限
export function getRoles( role ) {
  let roleName = ''
  switch ( role ) {
    case 1:
      roleName = 'superAdmin'
      break

    case 2:
      roleName = 'admin'
      break

    case 3:
      roleName = 'user'
      break
    default :
      roleName = 'user'
  }
  return roleName
}

export function replactProtcol( url ) {
  const protocol = window.location.protocol
  let newUrl = url
  if ( protocol.startsWith( 'https' ) ) {
    if ( !url.startsWith( 'https' ) ) {
      newUrl = 'https' + url.substring( 4 )
    }
  } else {
    if ( url.startsWith( 'https' ) ) {
      newUrl = 'https' + url.substring( 5 )
    }
  }
  return newUrl
}
// 获取文件名
export function getFileName( url ) {
  const pos = url.lastIndexOf( '/' )
  let fileName = ''
  if ( pos != -1 ) {
    fileName = url.substring( pos + 1 )
  }
  return fileName
}
// 简约风格
export function logger( { type, txt, data } ) {
  type = type || 'info'
  txt = txt || '前缀'
  data = data || ''
  if ( type === 'info' ) {
    window.console.info(
      `%c${txt}`,
      'color: blue; font-weight: 600',
      data
    )
  } else if ( type === 'warn' ) {
    window.console.info(
      `%c${txt}`,
      'color: blue; font-weight: 600',
      data
    )
  } else if ( type === 'error' ) {
    window.console.info(
      `%c${txt}`,
      'color: red; font-weight: 600',
      data
    )
  } else {
    window.console.info(
      `%c${txt}`,
      'color: blue; font-weight: 600',
      data
    )
  }
}
// 另一种风格
export function loggers( { type, txt, data, data1, data2, data3 } ) {
  type = type || 'info'
  txt = txt || '前缀'
  data = data || ''
  // eslint-disable-next-line default-case
  switch ( type ) {
    case 'log' :
      console.log(
        `%c${txt} %c`,
        'color: #000; font-weight: bold;background-color:yellow;padding : 0 3px;',
        'color: black; background-color:white;',
        data
      )
      break
    case 'info' :
      console.log(
        `%c${txt} %c`,
        'color: yellow; font-weight: 600;background-color:#000;padding : 0 3px;',
        'color: black; background-color:white;',
        data
      )
      break
    case 'warn' :
      console.log(
        `%c${txt}`,
        'color: blue; font-weight: 600;background-color:#000;padding : 0 3px;',
        'color: black; background-color:white;',
        data
      )
      break
    case 'error' :
      console.log(
        `%c${txt} %c`,
        'color: red; font-weight: 600;background-color:#000;padding : 0 3px;',
        'color: black; background-color:white;',
        data
      )
      break
    default :
      console.log(
        `%c${txt} %c`,
        'color: #000; font-weight: bold;background-color:yellow;padding : 0 3px;',
        'color: black; background-color:white;',
        data
      )
      break
  }
}
