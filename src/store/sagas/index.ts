import { all, AllEffect, ForkEffect, takeLatest } from 'redux-saga/effects'
import {
  claimNFTRequest,
  connectWalletRequest,
  disconnectWalletRequest,
  getPixelTokenAmountRequest,
  getPixelWalletNFTRequest,
  getStakedNFTsRequest,
  getWalletPixelNFTsAmountRequest,
  stakeNFTsRequest,
  unstakeNFTRequest,
} from '../reducers/wallet'
import {
  connectWallet,
  disconnectWallet,
  getPixelTokenAmount,
  getStackedNFTsInfo,
  getWalletPixelNFTs,
  getWalletPixelNFTsAmount,
} from './wallet'
import { claimNFTs, stakeNFTs, unstakeNFT } from './stake'

export default function* root(): Generator<AllEffect<ForkEffect>> {
  yield all([
    takeLatest(connectWalletRequest.type, connectWallet),
    takeLatest(getPixelTokenAmountRequest.type, getPixelTokenAmount),
    takeLatest(disconnectWalletRequest.type, disconnectWallet),
    takeLatest(getPixelWalletNFTRequest.type, getWalletPixelNFTs),
    takeLatest(stakeNFTsRequest.type, stakeNFTs),
    takeLatest(claimNFTRequest.type, claimNFTs),
    takeLatest(getStakedNFTsRequest.type, getStackedNFTsInfo),
    takeLatest(getWalletPixelNFTsAmountRequest.type, getWalletPixelNFTsAmount),
    takeLatest(unstakeNFTRequest.type, unstakeNFT),
  ])
}
