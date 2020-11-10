import React, { useReducer, useContext, useEffect } from 'react'

export const SessionContext = React.createContext({})

const initialState = {username: "", firstName: "", lastName: "", email: "", admin: false, token: ""}

const reducer = (state, action) => {
  switch (action.type) {
    case 'setSession':
      return {
        username: action.payload.username,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        email: action.payload.email,
        admin: action.payload.admin,
        token: action.payload.token,
      }
    case 'dropSession':
      return {
        username: initialState.username,
        firstName: initialState.firstName,
        lastName: initialState.lastName,
        email: initialState.email,
        admin: initialState.admin,
        token: initialState.token,
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

export const SessionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <SessionContext.Provider value={[state, dispatch]}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession: any = () => useContext(SessionContext)