import React from 'react'
import {useSession} from '../utils/SessionContext'

export default function Home() {
  const [state, dispatch] = useSession()
  return <h1>{state.username}</h1>
}
