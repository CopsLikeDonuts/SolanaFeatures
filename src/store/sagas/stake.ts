import { PayloadAction } from '@reduxjs/toolkit'
import { INFTWithImage, NFTWithStakeData } from 'types/assets'
import { Connection, PublicKey, PublicKeyInitData, Transaction } from '@solana/web3.js'
import { put, select, delay, SelectEffect, PutEffect, CallEffect } from 'redux-saga/effects'
import { publicKeySelector, stakedNFTDetailSelector, walletTypeSelector } from '../selectors/wallet'
import { transactionService } from 'services/transaction'
import { AppConsts } from 'config/constants/appConsts'
import {
  openClaimPopup,
  openStakePopup,
  openUnstakePopup,
  setConfirmSolflareMobile,
  setPopupError,
  setPopupStep,
} from '../reducers/popupStepper'
import {
  getPixelTokenAmountRequest,
  getPixelWalletNFTRequest,
  getStakedNFTsRequest,
  getWalletPixelNFTsAmountRequest,
  stakeNFTSuccess,
  unstakeNFTSuccess,
} from '../reducers/wallet'
import * as bs58 from 'bs58'
import { connectionService } from 'services/connection'
import {
  claimPopupOpenSelector,
  popupStepSelector,
  stakePopupOpenSelector,
  unstakePopupOpenSelector,
} from '../selectors/popupStepper'

const {
  WALLET_ERRORS: { USER_REJECTED_REQUEST, TRANSACTION_REJECTED, PHANTOM_INSUFFICIENT_FUNDS },
  PHANTOM_MOBILE_WALLET,
} = AppConsts

export function* stakeNFTs({
  payload,
}: PayloadAction<{
  nfts: INFTWithImage[]
  signAllTransactions: (transaction: Transaction[]) => Promise<Transaction[]>
}>): Generator<
  Promise<Transaction[]> | SelectEffect | Promise<string> | CallEffect | PutEffect,
  void,
  PublicKeyInitData & boolean & Transaction[] & string
> {
  try {
    const pubkey: PublicKey = new PublicKey(yield select(publicKeySelector))
    const walletType: string = yield select(walletTypeSelector)

    const { nfts, signAllTransactions } = payload

    const connection: Connection = connectionService.connection

    const transactions: Transaction[] = yield transactionService.prepareStakeNFTTransactions(pubkey, nfts)
    const signatures: string[] = []

    if (walletType === PHANTOM_MOBILE_WALLET) {
      const result: Transaction[] = yield signAllTransactions(transactions)
      result.map((transaction) => signatures.push(bs58.encode(transaction.signature as Buffer)))

      for (const res of result) {
        yield connection.sendRawTransaction(res.serialize())
      }
    } else {
      const result: Transaction[] = yield signAllTransactions(transactions)
      result.map((transaction) => signatures.push(bs58.encode(transaction.signature as Buffer)))

      for (const res of result) {
        yield connection.sendRawTransaction(res.serialize())
      }
    }

    yield put(setConfirmSolflareMobile())

    let confirmed = false

    while (!confirmed) {
      confirmed = yield delay(5000, transactionService.isTransactionsFinalized(signatures))
    }

    yield put(stakeNFTSuccess(transactions.length))
    yield delay(4000)
    yield put(getPixelWalletNFTRequest())
    yield put(getStakedNFTsRequest())
    const claimPopupOpen: boolean = yield select(claimPopupOpenSelector)
    const stakePopupOpen: boolean = yield select(stakePopupOpenSelector)
    const unstakePopupOpen: boolean = yield select(unstakePopupOpenSelector)
    const popupStep: number = yield select(popupStepSelector)
    if ((stakePopupOpen && popupStep === 1) || (!stakePopupOpen && !claimPopupOpen && !unstakePopupOpen)) {
      yield put(openStakePopup())
      yield put(setPopupStep(2))
    }
  } catch ({ message }) {
    const claimPopupOpen: boolean = yield select(claimPopupOpenSelector)
    const stakePopupOpen: boolean = yield select(stakePopupOpenSelector)
    const unstakePopupOpen: boolean = yield select(unstakePopupOpenSelector)
    const popupStep: number = yield select(popupStepSelector)
    if ((stakePopupOpen && popupStep === 1) || (!stakePopupOpen && !claimPopupOpen && !unstakePopupOpen)) {
      switch (message) {
        case USER_REJECTED_REQUEST:
        case TRANSACTION_REJECTED:
          yield put(
            setPopupError({ error: 'The NFT staking has been canceled, \n' + 'please try again', type: 'stake' })
          )
          break
        case PHANTOM_INSUFFICIENT_FUNDS:
          yield put(setPopupError({ error: 'Insufficient balance', type: 'stake' }))
          break
        default:
          yield put(setPopupError({ error: 'An unexpected error happened. Please try again', type: 'stake' }))
          break
      }
    }
  }
}

export function* claimNFTs({
  payload,
}: PayloadAction<{
  signTransaction: (transaction: Transaction) => Promise<Transaction>
}>): Generator<Promise<Transaction> | SelectEffect | Promise<string> | CallEffect | PutEffect, void, Buffer & null> {
  try {
    const { signTransaction } = payload
    const selectedNFT: NFTWithStakeData = yield select(stakedNFTDetailSelector)
    const pubkey: string = yield select(publicKeySelector)
    const walletType: string = yield select(walletTypeSelector)
    const connection: Connection = connectionService.connection
    const signatures: string[] = []

    const transaction: Transaction = yield transactionService.prepareClaimNFTTransactions(
      new PublicKey(pubkey),
      selectedNFT
    )

    if (walletType === PHANTOM_MOBILE_WALLET) {
      const result: Transaction = yield signTransaction(transaction)
      signatures.push(bs58.encode(transaction.signature as Buffer))
      yield connection.sendRawTransaction(result.serialize())
    } else {
      const result: Transaction = yield signTransaction(transaction)
      signatures.push(bs58.encode(transaction.signature as Buffer))
      yield connection.sendRawTransaction(result.serialize())
    }

    yield put(setConfirmSolflareMobile())

    let confirmed = false

    while (!confirmed) {
      confirmed = yield delay(5000, transactionService.isTransactionsFinalized(signatures))
    }

    yield put(getWalletPixelNFTsAmountRequest())
    yield put(getPixelTokenAmountRequest())
    yield put(getStakedNFTsRequest())

    const claimPopupOpen: boolean = yield select(claimPopupOpenSelector)
    const stakePopupOpen: boolean = yield select(stakePopupOpenSelector)
    const unstakePopupOpen: boolean = yield select(unstakePopupOpenSelector)
    const popupStep: number = yield select(popupStepSelector)
    if ((claimPopupOpen && popupStep === 1) || (!claimPopupOpen && !stakePopupOpen && !unstakePopupOpen)) {
      yield put(openClaimPopup())
      yield put(setPopupStep(2))
    }
  } catch ({ message }) {
    const claimPopupOpen: boolean = yield select(claimPopupOpenSelector)
    const stakePopupOpen: boolean = yield select(stakePopupOpenSelector)
    const unstakePopupOpen: boolean = yield select(unstakePopupOpenSelector)
    const popupStep: number = yield select(popupStepSelector)
    if ((claimPopupOpen && popupStep === 1) || (!claimPopupOpen && !stakePopupOpen && !unstakePopupOpen)) {
      switch (message) {
        case USER_REJECTED_REQUEST:
        case TRANSACTION_REJECTED:
          yield put(
            setPopupError({ error: 'The NFT claiming has been canceled, \n' + 'please try again', type: 'claim' })
          )
          break
        case PHANTOM_INSUFFICIENT_FUNDS:
          yield put(setPopupError({ error: 'Insufficient balance', type: 'claim' }))
          break
        default:
          yield put(setPopupError({ error: 'An unexpected error happened. Please try again', type: 'claim' }))
          break
      }
    }
  }
}

export function* unstakeNFT({
  payload,
}: PayloadAction<{
  signTransaction: (transaction: Transaction) => Promise<Transaction>
}>): Generator<Promise<Transaction> | SelectEffect | Promise<string> | CallEffect | PutEffect, void, Buffer & null> {
  try {
    const { signTransaction } = payload
    const pubkey: string = yield select(publicKeySelector)
    const selectedNFT: NFTWithStakeData = yield select(stakedNFTDetailSelector)
    const walletType: string = yield select(walletTypeSelector)
    const connection: Connection = connectionService.connection
    const signatures: string[] = []

    const transaction: Transaction = yield transactionService.prepareUnstakeNFTTransaction(
      new PublicKey(pubkey),
      selectedNFT
    )

    if (walletType === PHANTOM_MOBILE_WALLET) {
      const result: Transaction = yield signTransaction(transaction)
      signatures.push(bs58.encode(transaction.signature as Buffer))
      yield connection.sendRawTransaction(result.serialize())
    } else {
      const result: Transaction = yield signTransaction(transaction)
      signatures.push(bs58.encode(transaction.signature as Buffer))
      yield connection.sendRawTransaction(result.serialize())
    }

    yield put(setConfirmSolflareMobile())

    let confirmed = false

    while (!confirmed) {
      confirmed = yield delay(5000, transactionService.isTransactionsFinalized(signatures))
    }

    yield put(unstakeNFTSuccess(selectedNFT))
    yield put(getWalletPixelNFTsAmountRequest())
    yield put(getPixelWalletNFTRequest())
    yield put(getPixelTokenAmountRequest())

    const claimPopupOpen: boolean = yield select(claimPopupOpenSelector)
    const stakePopupOpen: boolean = yield select(stakePopupOpenSelector)
    const unstakePopupOpen: boolean = yield select(unstakePopupOpenSelector)
    const popupStep: number = yield select(popupStepSelector)
    if ((unstakePopupOpen && popupStep === 1) || (!claimPopupOpen && !stakePopupOpen && !unstakePopupOpen)) {
      yield put(openUnstakePopup())
      yield put(setPopupStep(2))
    }
  } catch ({ message }) {
    const claimPopupOpen: boolean = yield select(claimPopupOpenSelector)
    const stakePopupOpen: boolean = yield select(stakePopupOpenSelector)
    const unstakePopupOpen: boolean = yield select(unstakePopupOpenSelector)
    const popupStep: number = yield select(popupStepSelector)
    if ((unstakePopupOpen && popupStep === 1) || (!claimPopupOpen && !stakePopupOpen && !unstakePopupOpen)) {
      switch (message) {
        case USER_REJECTED_REQUEST:
        case TRANSACTION_REJECTED:
          yield put(
            setPopupError({ error: 'The NFT staking has been canceled, \n' + 'please try again', type: 'unstake' })
          )
          break
        case PHANTOM_INSUFFICIENT_FUNDS:
          yield put(setPopupError({ error: 'Insufficient balance', type: 'unstake' }))
          break
        default:
          yield put(setPopupError({ error: 'An unexpected error happened. Please try again', type: 'unstake' }))
          break
      }
    }
  }
}
