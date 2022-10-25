import { Nft } from '@metaplex-foundation/js'

export interface NFTWithInterest extends Nft {
  currentInterest: number
  expectedInterest: number
  stakePeriod: number
}
export interface INFTWithImage {
  name: string
  symbol: string
  image: string
  uri: string
  address: string
  metadataAddress: string
}

export interface NFTWithStakeData extends INFTWithImage {
  stakingPeriod: number
  expectedInterest: number
  currentInterest: number
}

export enum PlatformInstruction {
  GenerateVault,
  AddToWhitelist,
  Stake,
  Unstake,
  Claim,
}
