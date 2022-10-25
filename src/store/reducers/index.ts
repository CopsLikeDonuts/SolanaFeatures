import { combineReducers } from '@reduxjs/toolkit'
import { reducer as walletReducer } from './wallet'
import { reducer as popupStepperReducer } from './popupStepper'
import { IWalletState } from 'types/wallet'
import { IPopupStepperState } from 'types/popupStepper'

const rootReducer = combineReducers({
  wallet: walletReducer,
  popupStepper: popupStepperReducer,
})

export interface RootState {
  wallet: IWalletState
  popupStepper: IPopupStepperState
}

export default rootReducer
