import { NFTWithStakeData } from 'types/assets'
import BigNumber from 'bignumber.js'
import { AppConsts } from '../config/constants/appConsts'

const { DAILY_REWARD } = AppConsts

/**
 * Function changes public key display behaviour for wallet button
 */
export const shortcutWallet = (wallet: string): string => {
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
}

/**
 * Function rounds number to particular decimals
 */
export const normalizeNumber = (amount: number, digits = 2): number => {
  return parseFloat(amount.toFixed(digits))
}

/**
 * Function rounds number to 2 decimals
 */
export const roundNumberToTwoDecimals = (data: number): number => {
  const number = Math.round((data + Number.EPSILON) * 100) / 100
  return number < 0 ? 0 : number
}

/**
 * Function rounds number to 2 decimals
 */
export const roundNumberToTwoDecimalsAndNotNegative = (data: number): number => {
  const totalEarned = roundNumberToTwoDecimals(data)

  return totalEarned < 0 ? 0 : totalEarned
}

/**
 * Function calculates total expected interest
 */
export const calculateFutureExpectedInterest = (nfts: NFTWithStakeData[]): number => {
  const totalInterest = Math.round((nfts.reduce((a, b) => a + b.expectedInterest, 0) + Number.EPSILON) * 100) / 100
  return totalInterest < 0 ? 0 : totalInterest
}

/**
 * Function that adds "0" to number lower than 10
 */
const renderNumberWithZero = (number: number): string => {
  return number < 10 ? `0${number}` : `${number}`
}

/**
 * Function returns next day date
 */
export const getNextDayDate = (): string => {
  const now = new Date()
  const tomorrow = new Date(now.setDate(now.getDate() + 1))
  const tomorrowDay = tomorrow.getDate()
  const tomorrowMonth = tomorrow.getMonth() + 1
  const tomorrowYear = tomorrow.getFullYear()
  return `(by ${renderNumberWithZero(tomorrowDay)}.${renderNumberWithZero(tomorrowMonth)}.${renderNumberWithZero(
    tomorrowYear
  )})`
}

/**
 * Function gets stake program ID (smart contract) address depends on network
 */
export const getStakeProgramId = (): string => {
  return process.env.REACT_APP_NODE_ENV === 'development'
    ? (process.env.REACT_APP_STAKE_PROGRAM_ID as string)
    : (process.env.REACT_APP_STAKE_PROGRAM_ID_MAINNET as string)
}

/**
 * Function gets collection creator address depends on network
 */
export const getCollectionCreatorAddress = (): string => {
  return process.env.REACT_APP_NODE_ENV === 'development'
    ? (process.env.REACT_APP_COLLECTION_CREATOR_ADDRESS as string)
    : (process.env.REACT_APP_COLLECTION_CREATOR_ADDRESS_MAINNET as string)
}

/**
 * Function gets reward address depends on network
 */
export const getRewardTokenAddress = (): string => {
  return process.env.REACT_APP_NODE_ENV === 'development'
    ? (process.env.REACT_APP_REWARD_TOKEN_ADDRESS as string)
    : (process.env.REACT_APP_REWARD_TOKEN_ADDRESS_MAINNET as string)
}

/**
 * Function calculates total earned reward
 */

export const calculateTotalReward = (days: number): number => {
  let totalReward = 0
  for (let day = 1; day <= days; day++) {
    const dailyReward = new BigNumber(DAILY_REWARD).multipliedBy(day - 1)
    totalReward += dailyReward.toNumber()
  }
  return roundNumberToTwoDecimalsAndNotNegative(totalReward)
}
