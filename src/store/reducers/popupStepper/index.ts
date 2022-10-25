import { IPopupStepperState, PopupType } from 'types/popupStepper'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { INFTWithImage } from 'types/assets'

const initialState: IPopupStepperState = {
  step: 0,
  error: '',
  unstakePopupOpen: false,
  claimPopupOpen: false,
  stakePopupOpen: false,
  selectedNFTs: [],
  popupType: '',
  solflareMobileTransactionConfirmed: false,
}

/**
 * Reducer controls txn progress
 */
const popupStepperSlice = createSlice({
  name: 'popupStepper',
  initialState,
  reducers: {
    setPopupStep: (state, { payload }: PayloadAction<number>) => {
      state.step = payload
    },
    setPopupError: (state, { payload }: PayloadAction<{ error: string; type: PopupType }>) => {
      state.step = 3
      state.error = state.popupType === payload.type ? payload.error : ''
    },
    openStakePopup: (state) => {
      state.popupType = 'stake'
      state.stakePopupOpen = true
    },
    closeStakePopup: (state) => {
      state.stakePopupOpen = false
    },
    setSelectedNFTs: (state, { payload }: PayloadAction<INFTWithImage[]>) => {
      state.selectedNFTs = payload
    },
    openUnstakePopup: (state) => {
      state.popupType = 'unstake'
      state.unstakePopupOpen = true
    },
    closeUnstakePopup: (state) => {
      state.unstakePopupOpen = false
    },
    openClaimPopup: (state) => {
      state.popupType = 'claim'
      state.claimPopupOpen = true
    },
    closeClaimPopup: (state) => {
      state.claimPopupOpen = false
    },
    setConfirmSolflareMobile: (state) => {
      state.solflareMobileTransactionConfirmed = true
    },
    resetPopupState: (state) => {
      state.selectedNFTs = []
      state.solflareMobileTransactionConfirmed = false
      state.error = ''
    },
  },
})

export const {
  setPopupStep,
  setPopupError,
  resetPopupState,
  openStakePopup,
  closeStakePopup,
  openClaimPopup,
  closeClaimPopup,
  setSelectedNFTs,
  openUnstakePopup,
  closeUnstakePopup,
  setConfirmSolflareMobile,
} = popupStepperSlice.actions

export const { reducer } = popupStepperSlice
