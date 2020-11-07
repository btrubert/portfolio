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

// export async function getServerSideProps(context) {
//   const cookies = new Cookies(context.req.cookies)
//   const token = cookies.get("token")
//   const res = await fetch("http://127.0.0.1:3000/api/profile_info", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({token: token,})})
//   const data = await res.json()
//   // .then(data => 
//   //     dispatch({
//   //         type: 'setSession',
//   //         payload: {
//   //             username: data.user.username,
//   //             firstName: data.user.firstName,
//   //             lastName: data.user.lastName,
//   //             email: data.user.email,
//   //             admin: data.user.admin,
//   //             token: data.token,
//   //         }
//   //     }))
//   return {
//     props: {data}, // will be passed to the page component as props
//   }
// }