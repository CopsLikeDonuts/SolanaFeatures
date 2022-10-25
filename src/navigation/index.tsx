import React, { useEffect } from 'react'
import { IAppRouterProps } from './types'
import { appRoutes } from 'config/constants/appRoutes'
import NFTList from 'pages/NFTList'
import { Navigate, useRoutes } from 'react-router-dom'
import AuthRoute from './AuthRoute'
import NFTDetail from 'pages/NFTDetail'
import SecureRoute from './SecureRoute'
import StakeNFT from 'pages/StakeNFT'
import PrivacyPolicy from 'pages/PrivacyPolicy'
import TermsOfService from 'pages/TermsOfService'
import { stakeService } from 'services/stake'
import { setStakedNFTinPool } from 'store/reducers/wallet'
import { useDispatch, useSelector } from 'react-redux'
import { publicKeySelector } from 'store/selectors/wallet'

const { ROUTE_STAKED_NFT_LIST, ROUTE_NFT_DETAIL, ROUTE_STAKE_NFT, ROUTE_PRIVACY_POLICY, ROUTE_TERMS_OF_SERVICE } =
  appRoutes

const platformRoutes: IAppRouterProps[] = [
  {
    path: ROUTE_STAKED_NFT_LIST,
    element: <AuthRoute component={<NFTList/>} />,
  },
  {
    path: ROUTE_PRIVACY_POLICY,
    element: <AuthRoute component={<PrivacyPolicy />} />,
  },
  {
    path: ROUTE_TERMS_OF_SERVICE,
    element: <AuthRoute component={<TermsOfService />} />,
  },
  {
    path: ROUTE_NFT_DETAIL,
    element: <SecureRoute component={<NFTDetail />} />,
  },
  {
    path: ROUTE_STAKE_NFT,
    element: <SecureRoute component={<StakeNFT />} />,
  },
]

/**
 * App navigation component contains app routes and pages
 */

export default function AppNavigation(): React.ReactElement | null {
  const dispatch = useDispatch()
  const publicKey = useSelector(publicKeySelector)

  useEffect(() => {
    setInterval(async () => {
      const stakedNFTsInPool = await stakeService.getStakedNftsAmount()
      dispatch(setStakedNFTinPool(stakedNFTsInPool))
    }, 3600000)
  }, [publicKey, dispatch])

  const routes = [...platformRoutes, { path: '*', element: <Navigate to={ROUTE_STAKED_NFT_LIST} replace /> }]

  return useRoutes(routes)
}
