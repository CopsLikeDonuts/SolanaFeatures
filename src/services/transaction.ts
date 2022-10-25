import {
  Connection,
  PublicKey,
  Transaction,
  TransactionBlockhashCtor,
  TransactionInstruction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  RpcResponseAndContext,
  SignatureStatus,
} from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { INFTWithImage, NFTWithStakeData, PlatformInstruction } from 'types/assets'
import { connectionService } from './connection'
import { getCollectionCreatorAddress, getRewardTokenAddress, getStakeProgramId } from '../utils/wallet'

/**
 * Service preparing transactions for stake/unstake NFT, claim reward
 */
export class TransactionService {
  public programId: PublicKey
  public splAssociatedTokenProgramID: PublicKey
  public vaultPublicKey: PublicKey

  constructor() {
    this.programId = new PublicKey(getStakeProgramId())
    this.splAssociatedTokenProgramID = new PublicKey(
      process.env.REACT_APP_SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID as string
    )
    this.vaultPublicKey = new PublicKey(
      process.env.REACT_APP_NODE_ENV === 'development'
        ? (process.env.REACT_APP_VAULT_ADDRESS as string)
        : (process.env.REACT_APP_VAULT_ADDRESS_MAINNET as string)
    )
  }

  public async getSourceAddress(seedPubkey: PublicKey, sourceAddress: string): Promise<PublicKey> {
    const result = await PublicKey.findProgramAddress(
      [seedPubkey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), new PublicKey(sourceAddress).toBuffer()],
      this.splAssociatedTokenProgramID
    )
    return result[0]
  }

  public async getDestinationAddress(seedPubkey: PublicKey, destinationAddress: string): Promise<PublicKey> {
    const result = await PublicKey.findProgramAddress(
      [seedPubkey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), new PublicKey(destinationAddress).toBuffer()],
      this.splAssociatedTokenProgramID
    )
    return result[0]
  }

  public async getStakeDataAddress(nftMintAddress: string): Promise<PublicKey> {
    const result = await PublicKey.findProgramAddress([new PublicKey(nftMintAddress).toBuffer()], this.programId)
    return result[0]
  }

  public async getWhiteListAddress(): Promise<PublicKey> {
    const result = await PublicKey.findProgramAddress(
      [new Buffer('whitelist'), new PublicKey(getCollectionCreatorAddress()).toBuffer()],
      this.programId
    )
    return result[0]
  }

  public async prepareStakeNFTTransactions(pubkey: PublicKey, nfts: INFTWithImage[]): Promise<Transaction[]> {
    const connection = connectionService.connection
    const vaultPublicKey: PublicKey = this.vaultPublicKey
    const whitelistAddress: PublicKey = await this.getWhiteListAddress()
    const programId: PublicKey = this.programId

    const transactions: Transaction[] = []

    for (const nft of nfts) {
      const transaction = new Transaction()
      const [associatedSourceAddress, associatedDestinationAddress, stakeDataAddress] = await Promise.all([
        this.getSourceAddress(pubkey, nft.address),
        this.getDestinationAddress(vaultPublicKey, nft.address),
        this.getStakeDataAddress(nft.address),
      ])

      transaction.add(
        new TransactionInstruction({
          keys: [
            { pubkey, isSigner: true, isWritable: true },
            { pubkey: new PublicKey(nft.address), isSigner: false, isWritable: false },
            { pubkey: new PublicKey(nft.metadataAddress), isSigner: false, isWritable: false },
            { pubkey: vaultPublicKey, isSigner: false, isWritable: false },
            { pubkey: associatedSourceAddress, isSigner: false, isWritable: true },
            { pubkey: associatedDestinationAddress, isSigner: false, isWritable: true },
            {
              pubkey: new PublicKey(process.env.REACT_APP_SPL_TOKEN_ADDRESS as string),
              isSigner: false,
              isWritable: false,
            },
            {
              pubkey: SystemProgram.programId,
              isSigner: false,
              isWritable: false,
            },
            { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
            { pubkey: this.splAssociatedTokenProgramID, isSigner: false, isWritable: false },
            { pubkey: stakeDataAddress, isSigner: false, isWritable: true },
            { pubkey: whitelistAddress, isSigner: false, isWritable: true },
          ],
          programId,
          data: Buffer.from([PlatformInstruction.Stake]),
        })
      )

      const recentBlockhash: TransactionBlockhashCtor = await connection.getLatestBlockhash('finalized')
      transaction.recentBlockhash = recentBlockhash.blockhash
      transaction.feePayer = pubkey

      transactions.push(transaction)
    }
    return transactions
  }

  public async isTransactionsFinalized(hashes: string[]): Promise<boolean> {
    const signaturesStatus: RpcResponseAndContext<(SignatureStatus | null)[]> =
      await connectionService.connection.getSignatureStatuses(hashes, { searchTransactionHistory: true })
    return signaturesStatus.value.every((signature) => signature?.confirmationStatus === 'finalized')
  }

  public async prepareUnstakeNFTTransaction(pubkey: PublicKey, nft: NFTWithStakeData): Promise<Transaction> {
    const transaction: Transaction = new Transaction()
    const connection: Connection = connectionService.connection
    const vaultPublicKey: PublicKey = this.vaultPublicKey
    const programId: PublicKey = this.programId
    const rewardMintAddress: string = getRewardTokenAddress()

    const [
      stakeDataAddress,
      rewardDestinationAddress,
      rewardSourceAddress,
      destinationAddress,
      sourceAddress,
      whitelistAddress,
    ] = await Promise.all([
      this.getStakeDataAddress(nft.address),
      this.getDestinationAddress(pubkey, rewardMintAddress),
      this.getSourceAddress(vaultPublicKey, rewardMintAddress),
      this.getDestinationAddress(pubkey, nft.address),
      this.getSourceAddress(vaultPublicKey, nft.address),
      this.getWhiteListAddress(),
    ])

    transaction.add(
      new TransactionInstruction({
        keys: [
          { pubkey, isSigner: true, isWritable: true },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
          { pubkey: new PublicKey(nft.address), isSigner: false, isWritable: false },
          {
            pubkey: new PublicKey(process.env.REACT_APP_SPL_TOKEN_ADDRESS as string),
            isSigner: false,
            isWritable: false,
          },
          { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
          { pubkey: this.splAssociatedTokenProgramID, isSigner: false, isWritable: false },
          { pubkey: stakeDataAddress, isSigner: false, isWritable: true },
          { pubkey: vaultPublicKey, isSigner: false, isWritable: false },
          { pubkey: rewardDestinationAddress, isSigner: false, isWritable: true },
          { pubkey: rewardSourceAddress, isSigner: false, isWritable: true },
          { pubkey: destinationAddress, isSigner: false, isWritable: true },
          { pubkey: sourceAddress, isSigner: false, isWritable: true },
          { pubkey: new PublicKey(nft.metadataAddress), isSigner: false, isWritable: false },
          { pubkey: whitelistAddress, isSigner: false, isWritable: true },
          {
            pubkey: new PublicKey(getRewardTokenAddress()),
            isSigner: false,
            isWritable: false,
          },
        ],
        programId,
        data: Buffer.from([PlatformInstruction.Unstake]),
      })
    )

    const recentBlockhash: TransactionBlockhashCtor = await connection.getLatestBlockhash('finalized')

    transaction.recentBlockhash = recentBlockhash.blockhash
    transaction.feePayer = pubkey

    return transaction
  }

  public async prepareClaimNFTTransactions(pubkey: PublicKey, nft: NFTWithStakeData): Promise<Transaction> {
    const transaction: Transaction = new Transaction()
    const connection: Connection = connectionService.connection
    const vaultPublicKey: PublicKey = this.vaultPublicKey
    const programId: PublicKey = this.programId
    const rewardMintAddress: string = getRewardTokenAddress()

    const [
      stakeDataAddress,
      rewardDestinationAddress,
      rewardSourceAddress,
      destinationAddress,
      sourceAddress,
      whitelistAddress,
    ] = await Promise.all([
      this.getStakeDataAddress(nft.address),
      this.getDestinationAddress(pubkey, rewardMintAddress),
      this.getSourceAddress(vaultPublicKey, rewardMintAddress),
      this.getDestinationAddress(pubkey, nft.address),
      this.getSourceAddress(vaultPublicKey, nft.address),
      this.getWhiteListAddress(),
    ])

    transaction.add(
      new TransactionInstruction({
        keys: [
          { pubkey, isSigner: true, isWritable: true },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
          { pubkey: new PublicKey(nft.address), isSigner: false, isWritable: false },
          {
            pubkey: new PublicKey(process.env.REACT_APP_SPL_TOKEN_ADDRESS as string),
            isSigner: false,
            isWritable: false,
          },
          { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
          { pubkey: this.splAssociatedTokenProgramID, isSigner: false, isWritable: false },
          { pubkey: stakeDataAddress, isSigner: false, isWritable: true },
          { pubkey: vaultPublicKey, isSigner: false, isWritable: false },
          { pubkey: rewardDestinationAddress, isSigner: false, isWritable: true },
          { pubkey: rewardSourceAddress, isSigner: false, isWritable: true },
          { pubkey: destinationAddress, isSigner: false, isWritable: true },
          { pubkey: sourceAddress, isSigner: false, isWritable: true },
          { pubkey: new PublicKey(nft.metadataAddress), isSigner: false, isWritable: false },
          { pubkey: whitelistAddress, isSigner: false, isWritable: true },
          {
            pubkey: new PublicKey(getRewardTokenAddress()),
            isSigner: false,
            isWritable: false,
          },
        ],
        programId,
        data: Buffer.from([PlatformInstruction.Claim]),
      })
    )

    const recentBlockhash: TransactionBlockhashCtor = await connection.getLatestBlockhash('finalized')

    transaction.recentBlockhash = recentBlockhash.blockhash
    transaction.feePayer = pubkey

    return transaction
  }
}

export const transactionService = new TransactionService()
