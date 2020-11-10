import React from 'react'
import {useSession} from '../services/SessionContext'
import Cookies from "universal-cookie"


export default function Home(props) {
  const [state, dispatch] = useSession()
  if (props.data) {
    dispatch({
      type: 'setSession',
      payload: {
          username: props.data.user.username,
          firstName: props.data.user.firstName,
          lastName: props.data.user.lastName,
          email: props.data.user.email,
          admin: props.data.user.admin,
          token: props.data.token,
      }
    })
  }
  return <h1>{state.username}</h1>
}
