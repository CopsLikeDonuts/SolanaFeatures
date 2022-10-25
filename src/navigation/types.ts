export interface IRouteProps {
  component: JSX.Element
}

export interface IAppRouterProps {
  path: string
  element: JSX.Element
  rest?: Record<string, unknown>
}
