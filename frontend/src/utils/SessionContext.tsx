import React, { useReducer, useContext, useEffect } from 'react'

interface State {
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  admin: boolean,
  token: string,
  loading: boolean,
}

interface Action {
  type: 'setSession' | 'dropSession',
  payload: State,
}

export const SessionContext = React.createContext({})

const initialState: State = {username: "", firstName: "", lastName: "", email: "", admin: false, token: "", loading: true}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setSession':
      return {
        username: action.payload.username,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        email: action.payload.email,
        admin: action.payload.admin,
        token: action.payload.token,
        loading: false,
      }
    case 'dropSession':
      return {
        username: initialState.username,
        firstName: initialState.firstName,
        lastName: initialState.lastName,
        email: initialState.email,
        admin: initialState.admin,
        token: initialState.token,
        loading: false,
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

export const SessionProvider = ({children}: any ) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <SessionContext.Provider value={[state, dispatch]}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession: any = () => useContext(SessionContext)