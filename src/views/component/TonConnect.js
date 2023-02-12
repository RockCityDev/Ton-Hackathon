import {
  TonConnect,
  // UserRejectsError,
  // WalletInfo,
  // WalletInfoInjected,
  isWalletInfoInjected
} from '@tonconnect/sdk'

// import { Address } from 'ton'

const dappMetadata = {
  manifestUrl : 'https://d3l1ioscvnrz88.cloudfront.net/ton/static/gistfile1.txt'
}
export const connector = new TonConnect( dappMetadata )

export async function getWalletList() {
  return new Promise( async( resolve, reject ) => {
    try {
      const walletsList = await connector.getWallets()
      const embeddedWallet = walletsList
        .filter( isWalletInfoInjected )
        .find( wallet => wallet.embedded )
      resolve( {
        walletsList,
        embeddedWallet,
        connector
      } )
    } catch ( error ) {
      this.walletsList = undefined
      this.embeddedWallet = undefined
      reject( error )
    }
  } )
}

export async function sendTransaction( tx, wallet ) {
  try {
    const result = await connector.sendTransaction( tx )
    return result
  } catch ( e ) {
    throw e
  }
}

export function addReturnStrategy( url, returnStrategy ) {
  // const link = new URL( url )
  // link.searchParams.append( 'ret', returnStrategy )
  // return link.toString()
}
