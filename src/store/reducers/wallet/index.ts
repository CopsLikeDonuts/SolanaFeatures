import { IWalletState } from 'types/wallet'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { INFTWithImage, NFTWithStakeData } from 'types/assets'

const initialState: IWalletState = {
  walletType: '',
  publicKey: '',
  loading: false,
  loadingWalletNFT: false,
  loadingStakedNFT: false,
  connectingWallet: false,
  pixelWalletNFTS: [],
  pixelWalletNFTsAmount: 0,
  nftDetail: {
    name: '',
    symbol: '',
    image: '',
    uri: '',
    address: '',
    metadataAddress: '',
    stakingPeriod: 0,
    expectedInterest: 0,
    currentInterest: 0,
  },
  stakedNFTS: [],
  pixelTokenAmount: '',
  stakedNFTinPool: 0,
  error: '',
}

/**
 * Reducer for wallet state
 * pPIXL balance, NFT balance, staked NFT data
 */
const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    connectWalletRequest: (state, _) => {
      state.connectingWallet = true
      state.error = ''
    },
    connectWalletSuccess: (state, { payload }: PayloadAction<string>) => {
      state.connectingWallet = false
      state.publicKey = payload
    },
    connectWalletFailure: (state, { payload }) => {
      state.connectingWallet = false
      state.error = payload
    },
    disconnectWalletRequest: (state, _) => {
      state.loading = true
      state.error = ''
    },
    disconnectWalletSuccess: () => initialState,
    disconnectWalletFailure: (state, { payload }) => {
      state.loading = false
      state.error = payload
    },
    setWalletType: (state, { payload }: PayloadAction<string>) => {
      state.walletType = payload
    },
    getPixelTokenAmountRequest: (state) => {
      state.error = ''
    },
    getPixelTokenAmountSuccess: (state, { payload }: PayloadAction<string>) => {
      state.pixelTokenAmount = payload
    },
    getPixelTokenAmountFailure: (state, { payload }) => {
      state.error = payload
    },
    getPixelWalletNFTRequest: (state) => {
      state.loadingWalletNFT = true
      state.error = ''
    },
    getPixelWalletNFTSuccess: (state, { payload }: PayloadAction<INFTWithImage[]>) => {
      state.pixelWalletNFTS = payload
      state.loadingWalletNFT = false
    },
    getPixelWalletNFTFailure: (state, { payload }) => {
      state.loadingWalletNFT = false
      state.error = payload
    },
    stakeNFTsRequest: (state, _) => {
      state.error = ''
    },
    stakeNFTSuccess: (state, { payload }: PayloadAction<number>) => {
      state.stakedNFTinPool = state.stakedNFTinPool + payload
    },
    setPixelTokenAmount: (state, { payload }: PayloadAction<string>) => {
      state.pixelTokenAmount = payload
    },
    getStakedNFTsRequest: (state) => {
      state.loadingStakedNFT = true
      state.error = ''
    },
    getStakedNFTsSuccess: (state, { payload }: PayloadAction<NFTWithStakeData[]>) => {
      state.loadingStakedNFT = false
      state.stakedNFTS = payload
    },
    getStakedNFTsFailure: (state, { payload }) => {
      state.loadingStakedNFT = false
      state.error = payload
    },
    setStakedNFTinPool: (state, { payload }: PayloadAction<number>) => {
      state.stakedNFTinPool = payload
    },
    setSelectedNFTDetail: (state, { payload }: PayloadAction<NFTWithStakeData>) => {
      state.nftDetail = payload
    },
    resetNFTDetailState: (state) => {
      state.nftDetail = initialState.nftDetail
    },
    getWalletPixelNFTsAmountRequest: (state) => {
      state.error = ''
    },
    getWalletPixelNFTsAmountSuccess: (state, { payload }: PayloadAction<number>) => {
      state.pixelWalletNFTsAmount = payload
    },
    getWalletPixelNFTsAmountFailure: (state, { payload }) => {
      state.error = payload
    },
    unstakeNFTRequest: (state, _) => {
      state.error = ''
    },
    unstakeNFTSuccess: (state, { payload }: PayloadAction<NFTWithStakeData>) => {
      state.stakedNFTS = state.stakedNFTS.filter((item) => item.address !== payload.address)
      state.stakedNFTinPool = state.stakedNFTinPool - 1
    },
    claimNFTRequest: (state, _) => {
      state.error = ''
    },
  },
})

export const {
  connectWalletRequest,
  connectWalletSuccess,
  connectWalletFailure,

  disconnectWalletRequest,
  disconnectWalletSuccess,
  disconnectWalletFailure,

  getPixelWalletNFTRequest,
  getPixelWalletNFTSuccess,
  getPixelWalletNFTFailure,

  getStakedNFTsRequest,
  getStakedNFTsSuccess,
  getStakedNFTsFailure,

  getPixelTokenAmountRequest,
  getPixelTokenAmountSuccess,
  getPixelTokenAmountFailure,

  getWalletPixelNFTsAmountRequest,
  getWalletPixelNFTsAmountSuccess,
  getWalletPixelNFTsAmountFailure,

  unstakeNFTRequest,
  unstakeNFTSuccess,

  stakeNFTsRequest,
  stakeNFTSuccess,

  claimNFTRequest,
  setStakedNFTinPool,
  setSelectedNFTDetail,
  resetNFTDetailState,
  setWalletType,
} = walletSlice.actions

export const { reducer } = walletSlice
