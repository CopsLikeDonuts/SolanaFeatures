import { PublicKey, AccountInfo } from '@solana/web3.js'
import { Metaplex, Nft } from '@metaplex-foundation/js'
import { connectionService } from './connection'
import { transactionService } from './transaction'
import { AppConsts } from 'config/constants/appConsts'
import { NFTWithInterest, NFTWithStakeData } from 'types/assets'
import axios from 'axios'
import { getCollectionCreatorAddress, getStakeProgramId } from '../utils/wallet'
import BigNumber from 'bignumber.js'

const { MAX_STAKE_PERIOD, DAY_IN_SECONDS, DAILY_REWARD, MAX_REWARD, REWARD_PRECISION, REWARD_LAST_DAY } = AppConsts

/**
 * Class returns base stake NFT data
 */
export class StakeInfo {
  timestamp: number
  staker: PublicKey
  mint: PublicKey
  active: boolean
  withdrawn: number
  harvested: number

  constructor(buf: Buffer) {
    let offset = 0
    this.timestamp = Number(buf.readBigUInt64LE(offset))
    offset += 8
    this.staker = new PublicKey(buf.slice(offset, offset + 32))
    offset += 32
    this.mint = new PublicKey(buf.slice(offset, offset + 32))
    offset += 32
    this.active = buf.readUInt8(offset) !== 0
    offset += 1
    this.withdrawn = Number(buf.readBigUInt64LE(offset))
    offset += 8
    this.harvested = Number(buf.readBigUInt64LE(offset))
  }
}

/**
 * Service collecting all needed staked data
 */
export class StakeService {
  public programId: PublicKey
  public splAssociatedTokenProgramID: PublicKey

  constructor() {
    this.programId = new PublicKey(getStakeProgramId())
    this.splAssociatedTokenProgramID = new PublicKey(
      process.env.REACT_APP_SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID as string
    )
  }

  public async getStakeInfo(nfts: PublicKey[]): Promise<(StakeInfo | undefined)[]> {
    let result: PublicKey[] = []
    for (const nft of nfts) {
      const res: [PublicKey, number] = await PublicKey.findProgramAddress(
        [new PublicKey(nft).toBuffer()],
        this.programId
      )
      result.push(res[0])
    }

    const accounts: (AccountInfo<Buffer> | null)[] = []

    const allData: PublicKey[][] = []

    if (result.length > 100) {
      while (result.length !== 0) {
        allData.push(result.slice(0, 100))
        result = result.slice(100)
      }
    } else {
      allData.push(result)
    }

    const res: (AccountInfo<Buffer> | null)[][] = await Promise.all(
      allData.map(async (dataItem) => await connectionService.connection.getMultipleAccountsInfo(dataItem))
    )

    res.forEach((item) => accounts.push(...item))

    return accounts.map((acc) => {
      if (acc) {
        return new StakeInfo(acc.data)
      }
      return
    })
  }

  public async getStakePeriod(now: number, stakeInfo?: StakeInfo): Promise<number> {
    if (!stakeInfo) {
      return 0
    }

    const time_in_stake = now - stakeInfo.timestamp
    return parseInt(`${time_in_stake / DAY_IN_SECONDS}`)
  }

  public async getWalletPixelNFTs(pubkey: PublicKey): Promise<Nft[]> {
    const allWalletNFTs: Nft[] = await Metaplex.make(connectionService.connection).nfts().findAllByOwner(pubkey)
    const collectionCreatorAddress = getCollectionCreatorAddress()
    const assetsFilter = (nft: Nft) =>
      nft.creators ? nft.creators[0].address.toString() === collectionCreatorAddress : nft.symbol === 'PP'
    return allWalletNFTs.filter(assetsFilter)
  }

  public getCurrentReward(stakeInfo: StakeInfo, now: number): number {
    const timeInStake = now - stakeInfo.timestamp
    const periods = Math.floor(timeInStake / DAY_IN_SECONDS)

    if (periods <= 1) {
      return 0
    }

    const withdrawn = stakeInfo.withdrawn
    const harvested = stakeInfo.harvested

    if (harvested >= MAX_REWARD) {
      return 0
    }

    let reward = 0
    if (periods >= REWARD_LAST_DAY) {
      reward = MAX_REWARD
    } else {
      for (let day = 1; day <= periods; day++) {
        const dailyReward = new BigNumber(DAILY_REWARD).multipliedBy(day - 1)
        reward += dailyReward.toNumber()
      }
    }

    const currentInterest = reward - new BigNumber(withdrawn).dividedBy(REWARD_PRECISION).toNumber()

    if (currentInterest <= 0) {
      return 0
    }

    return currentInterest
  }

  public async getStakedNftsForOwner(owner: PublicKey): Promise<NFTWithInterest[]> {
    const vault = transactionService.vaultPublicKey
    const Nfts: Nft[] = await this.getWalletPixelNFTs(vault)
    const NFTsPubkeys = Nfts.map((nft) => nft.mint)
    const slot: number = await connectionService.connection.getSlot()
    let now = await connectionService.getTimestamp(slot)
    while (!now) {
      now = await connectionService.getTimestamp(slot)
    }
    const userStakeInfo = await this.getStakeInfo(NFTsPubkeys)

    const ownerNfts: NFTWithInterest[] = []

    for (let i = 0; i < Nfts.length; i++) {
      if (userStakeInfo[i]?.staker.toString() === owner.toString()) {
        const [expectedInterest, stakePeriod] = await Promise.all([
          this.getExpectedInterest(now as number, userStakeInfo[i]),
          this.getStakePeriod(now as number, userStakeInfo[i]),
        ])
        const nftWithInterest = {
          ...Nfts[i],
          currentInterest: this.getCurrentReward(userStakeInfo[i] as StakeInfo, now as number),
          expectedInterest,
          stakePeriod,
        } as NFTWithInterest
        ownerNfts.push(nftWithInterest)
      }
    }

    return ownerNfts
  }

  public async getStakingPageInfo(owner: PublicKey): Promise<NFTWithStakeData[]> {
    const nfts: NFTWithInterest[] = await this.getStakedNftsForOwner(owner)
    const slot: number = await connectionService.connection.getSlot()
    let now = await connectionService.getTimestamp(slot)
    while (!now) {
      now = await connectionService.getTimestamp(slot)
    }

    const images = await this.getNFTImages(nfts)

    return nfts.map((nft, index) => ({
      name: nft.name,
      symbol: nft.symbol,
      image: images[index],
      uri: nft.uri,
      address: nft.mint.toJSON(),
      metadataAddress: nft.metadataAccount.publicKey.toString(),
      stakingPeriod: nft.stakePeriod,
      expectedInterest: nft.expectedInterest,
      currentInterest: nft.currentInterest,
    }))
  }

  // origin source - https://bitbucket.ideasoft.io/projects/PIX/repos/backend/browse/client/src/client.ts#122
  public async getExpectedInterest(now: number, stakeInfo?: StakeInfo): Promise<number> {
    if (!stakeInfo) {
      return 0
    }

    const timeInStake = now - stakeInfo.timestamp
    const periods = Math.floor(timeInStake / DAY_IN_SECONDS)

    const reward = periods > MAX_STAKE_PERIOD ? 0 : periods * DAILY_REWARD

    if (stakeInfo.harvested + reward * 100000000 > MAX_REWARD) {
      return (MAX_REWARD - stakeInfo.harvested) / 100000000
    }

    return reward
  }

  public async getStakedNftsAmount(): Promise<number> {
    const vault = await transactionService.vaultPublicKey
    const Nfts: Nft[] = await this.getWalletPixelNFTs(vault)
    return Nfts.length
  }

  public async getNFTImage(nft: Nft): Promise<string> {
    const {
      data: { image },
    } = await axios.get(nft.uri)
    return image
  }

  public async getNFTImages(nfts: Nft[]): Promise<string[]> {
    const res = await Promise.all(nfts.map((nft) => axios.get(nft.uri)))
    return res.map((resItem) => resItem.data.image)
  }
}

export const stakeService = new StakeService()
