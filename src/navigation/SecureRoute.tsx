import React from 'react'
import { IRouteProps } from './types'
import { useSelector } from 'react-redux'
import { publicKeySelector } from '../store/selectors/wallet'
import AppLayout from '../components/AppLayout'
import { Navigate } from 'react-router-dom'
import { appRoutes } from '../config/constants/appRoutes'

const { ROUTE_STAKED_NFT_LIST } = appRoutes

/**
 * Route for page in case wallet is connected
 * Redirects from any non existed page to main page
 * Redirects from any page wallet must be connected
 */
export default function SecureRoute({ component }: IRouteProps): JSX.Element {
  const publicKey = useSelector(publicKeySelector)

  return publicKey ? <AppLayout>{component}</AppLayout> : <Navigate to={ROUTE_STAKED_NFT_LIST} />
}
