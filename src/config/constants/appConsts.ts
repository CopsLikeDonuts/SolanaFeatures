export const AppConsts = {
  WALLET_STATE_TYPE: {
    INSTALLED: 'Installed',
    LOADABLE: 'Loadable',
    NOT_DETECTED: 'NotDetected',
  },
  SORT_TYPE: {
    STAKING_PERIOD: 'stakingPeriod',
    EXPECTED_INTEREST: 'expectedInterest',
    ALPHABETICALLY: 'alphabetically',
  },
  SORT_DIRECTION: {
    ASCENDING: 'ASC',
    DESCENDING: 'DESC',
  },
  SOLFLARE_WALLET_TYPE: {
    SOLFLARE_WALLET_EXTENSION: 'extension',
    SOLFLARE_WALLET_WEB: 'native_web',
  },
  PHANTOM_MOBILE_WALLET: 'PhantomMobileApp',
  MAX_STAKE_PERIOD: 180,
  DAY_IN_SECONDS: 24 * 60 * 60,
  DAILY_REWARD: 0.07438286,
  MAX_REWARD: 119830787460,
  REWARD_PRECISION: 100000000,
  REWARD_LAST_DAY: 180,
  WALLET_ERRORS: {
    TRANSACTION_REJECTED: 'Transaction rejected',
    USER_REJECTED_REQUEST: 'User rejected the request.',
    PHANTOM_INSUFFICIENT_FUNDS:
      'failed to send transaction: Transaction simulation failed: Attempt to debit an account but found no record of a prior credit.',
  },
  CONNECTING_WALLET_KEY: 'connecting_wallet',
  SUPPORTED_WALLET_TYPE: {
    PHANTOM: 'phantom',
    SOLFLARE: 'Solflare',
  },
  CONNECTING_WALLET_RETRY_KEY: 'connecting_try',
  CONNECTING_WALLET_RETRY: 1000,
}
