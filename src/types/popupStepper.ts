import { INFTWithImage } from './assets'

export interface IPopupStepperState {
  step: number
  error: string
  unstakePopupOpen: boolean
  claimPopupOpen: boolean
  stakePopupOpen: boolean
  selectedNFTs: INFTWithImage[]
  popupType: PopupType
  solflareMobileTransactionConfirmed: boolean
}

export type PopupType = 'stake' | 'unstake' | 'claim' | ''
