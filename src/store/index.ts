import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas'
import rootReducer from './reducers'

export default function configStore(): EnhancedStore {
  const sagaMiddleware = createSagaMiddleware()

  const store = configureStore({
    reducer: rootReducer,
    middleware: [sagaMiddleware],
    devTools: process.env.NODE_ENV !== 'production',
  })

  sagaMiddleware.run(rootSaga)

  return store
}

export const rootStore = configStore()
