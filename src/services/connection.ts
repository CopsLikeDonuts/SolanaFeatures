import {
  AccountInfo,
  clusterApiUrl,
  Connection,
  ParsedAccountData,
  PublicKey,
  RpcResponseAndContext,
} from '@solana/web3.js'
import { getRewardTokenAddress } from '../utils/wallet'

/**
 * Service for establishing RPC connection and functions gets pPIXL balance and NFTs data
 */
export class ConnectionService {
  public connection: Connection
  public platformTokenPubkey: PublicKey
  constructor() {
    this.connection = new Connection(
      process.env.REACT_APP_NODE_ENV === 'development'
        ? clusterApiUrl('devnet')
        : (process.env.REACT_APP_CUSTOM_RPC_LINK as string)
    )
    this.platformTokenPubkey = new PublicKey(getRewardTokenAddress())
  }

  public async getPlatformTokenBalance(pubkey: string): Promise<string> {
    const res: RpcResponseAndContext<
      Array<{
        pubkey: PublicKey
        account: AccountInfo<ParsedAccountData>
      }>
    > = await this.connection.getParsedTokenAccountsByOwner(new PublicKey(pubkey), { mint: this.platformTokenPubkey })
    return res.value[0] ? res.value[0].account.data.parsed.info.tokenAmount.uiAmount : '0'
  }

  public async getTimestamp(slot: number): Promise<number | undefined> {
    try {
      const block: number | null = await this.connection.getBlockTime(slot)
      return block as number
    } catch ({ message }) {
      console.log(message)
    }
  }
}

export const connectionService = new ConnectionService()
