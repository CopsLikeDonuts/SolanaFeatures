import { Wallet } from '@solana/wallet-adapter-react'
import { INFTWithImage, NFTWithStakeData } from './assets'

export interface IWalletState {
  walletType: string
  publicKey: string
  loading: boolean
  connectingWallet: boolean
  loadingWalletNFT: boolean
  loadingStakedNFT: boolean
  stakedNFTS: NFTWithStakeData[]
  nftDetail: NFTWithStakeData
  error: string
  pixelWalletNFTS: INFTWithImage[]
  pixelWalletNFTsAmount: number
  pixelTokenAmount: string
  stakedNFTinPool: number
}

export interface IConnectWalletPayloadType {
  walletContext?: Wallet | null
  isMobile: boolean
}
