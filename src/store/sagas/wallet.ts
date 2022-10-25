import { put, PutEffect, select, take, TakeEffect, SelectEffect, CallEffect } from 'redux-saga/effects'
import {
  connectWalletFailure,
  connectWalletRequest,
  connectWalletSuccess,
  disconnectWalletFailure,
  disconnectWalletSuccess,
  getPixelTokenAmountFailure,
  getPixelTokenAmountSuccess,
  getPixelWalletNFTFailure,
  getPixelWalletNFTSuccess,
  getStakedNFTsFailure,
  getStakedNFTsSuccess,
  getWalletPixelNFTsAmountFailure,
  getWalletPixelNFTsAmountRequest,
  getWalletPixelNFTsAmountSuccess,
  setStakedNFTinPool,
  setWalletType,
} from '../reducers/wallet'
import { PayloadAction } from '@reduxjs/toolkit'
import { IConnectWalletPayloadType } from 'types/wallet'
import { PublicKey } from '@solana/web3.js'
import { AppConsts } from 'config/constants/appConsts'
import { Nft } from '@metaplex-foundation/js'
import { INFTWithImage, NFTWithStakeData } from 'types/assets'
import { connectionService } from 'services/connection'
import { publicKeySelector } from '../selectors/wallet'
import { stakeService } from 'services/stake'

const {
  SOLFLARE_WALLET_TYPE: { SOLFLARE_WALLET_WEB, SOLFLARE_WALLET_EXTENSION },
  PHANTOM_MOBILE_WALLET,
  WALLET_ERRORS: { USER_REJECTED_REQUEST },
} = AppConsts

export function* connectWallet({
  payload,
}: PayloadAction<IConnectWalletPayloadType>): Generator<Promise<void> | PutEffect | CallEffect | undefined, void> {
  try {
    const { walletContext } = payload
    yield walletContext?.adapter.connect()
    const pubkey: PublicKey = walletContext?.adapter.publicKey as PublicKey
    yield put(setWalletType(walletContext?.adapter.name as string))

    yield put(connectWalletSuccess(pubkey.toString() as string))
  } catch ({ message }) {
    switch (message) {
      case '':
      case USER_REJECTED_REQUEST:
        if (window.screen.width > 1023) {
          localStorage.setItem('solflarePreferredWalletAdapter', SOLFLARE_WALLET_EXTENSION)
        }
        yield put(connectWalletFailure('User denied wallet connection'))
        break
      default:
        yield put(connectWalletRequest(payload))
        break
    }
  }
}

export function* getPixelTokenAmount(): Generator<
  TakeEffect | SelectEffect | Promise<string> | PutEffect,
  void,
  string
> {
  try {
    const pubkey: string = yield select(publicKeySelector)

    const pixlBalance: string = yield connectionService.getPixelsTokenBalance(pubkey)

    yield put(getPixelTokenAmountSuccess(pixlBalance))
  } catch ({ message }) {
    yield put(getPixelTokenAmountFailure(message))
  }
}

export function* disconnectWallet({
  payload,
}: PayloadAction<Pick<IConnectWalletPayloadType, 'walletContext' | 'isMobile'>>): Generator<
  Promise<void> | PutEffect | undefined,
  void
> {
  try {
    const { walletContext, isMobile } = payload

    yield walletContext?.adapter.disconnect()
    if (walletContext?.adapter.name === 'Solflare') {
      localStorage.setItem('solflarePreferredWalletAdapter', isMobile ? SOLFLARE_WALLET_WEB : SOLFLARE_WALLET_EXTENSION)
    }
    localStorage.removeItem(PHANTOM_MOBILE_WALLET)
    yield put(disconnectWalletSuccess())
  } catch ({ message }) {
    yield put(disconnectWalletFailure(message))
  }
}

export function* getWalletPixelNFTsAmount(): Generator<
  SelectEffect | Promise<Nft[]> | TakeEffect | PutEffect,
  void,
  Nft[] & string
> {
  try {
    const pubkey: string = yield select(publicKeySelector)

    const walletNFTs: Nft[] = yield stakeService.getWalletPixelNFTs(new PublicKey(pubkey))

    yield put(getWalletPixelNFTsAmountSuccess(walletNFTs.length))
  } catch ({ message }) {
    yield put(getWalletPixelNFTsAmountFailure(message))
  }
}

export function* getWalletPixelNFTs(): Generator<
  SelectEffect | Promise<Nft[]> | Promise<string[]> | PutEffect | Promise<void>,
  void,
  Nft[] & string[] & string
> {
  try {
    const pubkey: string = yield select(publicKeySelector)
    const walletNFTs: Nft[] = yield stakeService.getWalletPixelNFTs(new PublicKey(pubkey))

    const images: string[] = yield stakeService.getNFTImages(walletNFTs)

    const result: INFTWithImage[] = walletNFTs.map(({ name, symbol, uri, mint, metadataAccount }, index) => {
      return {
        name,
        symbol,
        image: images[index],
        uri,
        address: mint.toJSON(),
        metadataAddress: metadataAccount.publicKey.toString(),
      }
    })

    yield put(getPixelWalletNFTSuccess(result))
  } catch ({ message }) {
    yield put(getPixelWalletNFTFailure(message))
  }
}

export function* getStackedNFTsInfo(): Generator<
  SelectEffect | Promise<NFTWithStakeData[]> | Promise<number> | TakeEffect | PutEffect,
  void,
  NFTWithStakeData[] & number & string
> {
  try {
    const publicKey: string = yield select(publicKeySelector)
    const stakedNFTs: NFTWithStakeData[] = yield stakeService.getStakingPageInfo(new PublicKey(publicKey))
    const stakedNFTSInPool: number = yield stakeService.getStakedNftsAmount()
    yield put(setStakedNFTinPool(stakedNFTSInPool))

    yield put(getWalletPixelNFTsAmountRequest())

    yield take(getWalletPixelNFTsAmountSuccess)

    yield put(getStakedNFTsSuccess(stakedNFTs))
  } catch ({ message }) {
    yield put(getStakedNFTsFailure(message))
  }
}
