import { RootState } from '../reducers'
import { INFTWithImage, NFTWithStakeData } from 'types/assets'

export const publicKeySelector = (state: RootState): string => state.wallet.publicKey

export const connectingWalletSelector = (state: RootState): boolean => state.wallet.connectingWallet

export const walletTypeSelector = (state: RootState): string => state.wallet.walletType

export const walletPixelNFTSelector = (state: RootState): INFTWithImage[] => state.wallet.pixelWalletNFTS

export const walletPixelNFTLoading = (state: RootState): boolean => state.wallet.loadingWalletNFT

export const stakedNFTSelector = (state: RootState): NFTWithStakeData[] => state.wallet.stakedNFTS

export const stakedNFTLoadingSelector = (state: RootState): boolean => state.wallet.loadingStakedNFT

export const stakedNFTinPoolSelector = (state: RootState): number => state.wallet.stakedNFTinPool

export const pixelsTokenAmountSelector = (state: RootState): string => state.wallet.pixelTokenAmount

export const stakedNFTDetailSelector = (state: RootState): NFTWithStakeData => state.wallet.nftDetail

export const walletPixelNFTAmountSelector = (state: RootState): number => state.wallet.pixelWalletNFTsAmount
