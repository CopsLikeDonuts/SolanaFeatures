import { RootState } from '../reducers'
import { INFTWithImage } from 'types/assets'
import { PopupType } from 'types/popupStepper'

export const popupStepSelector = (state: RootState): number => state.popupStepper.step

export const popupErrorSelector = (state: RootState): string => state.popupStepper.error

export const unstakePopupOpenSelector = (state: RootState): boolean => state.popupStepper.unstakePopupOpen

export const claimPopupOpenSelector = (state: RootState): boolean => state.popupStepper.claimPopupOpen

export const stakePopupOpenSelector = (state: RootState): boolean => state.popupStepper.stakePopupOpen

export const selectedNFTsSelector = (state: RootState): INFTWithImage[] => state.popupStepper.selectedNFTs

export const popupTypeSelector = (state: RootState): PopupType => state.popupStepper.popupType

export const solflareMobileTransactionConfirmedSelector = (state: RootState): boolean =>
  state.popupStepper.solflareMobileTransactionConfirmed
