import React, { useReducer, useContext } from 'react'

interface State {
    common: object,
    commonTrans: boolean,
}

interface Action {
  type: 'setCommon' | 'setPage' | 'reset',
  payload: object,
}

export const TranslationContext = React.createContext({})

const initialState: State = {common: {}, commonTrans: false}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setCommon':
        return {
            common: action.payload,
            commonTrans: true,
        }
    case 'reset':
        return {
            common: initialState.common,
            commonTrans: initialState.commonTrans,
        }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

export const TranslationProvider = ({children}: any ) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <TranslationContext.Provider value={[state, dispatch]}>
      {children}
    </TranslationContext.Provider>
  )
}

export const useTranslation: any = () => useContext(TranslationContext)