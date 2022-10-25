import React from 'react'
import { IRouteProps } from './types'
import AppLayout from '../components/AppLayout'

/**
 * Route for page in case wallet is not connected
 */

export default function AuthRoute({ component }: IRouteProps): JSX.Element {
  return <AppLayout>{component}</AppLayout>
}
