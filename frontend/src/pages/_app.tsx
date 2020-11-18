import 'bootstrap/dist/css/bootstrap.min.css'
import 'styles/app.scss'
import Head from 'next/head'
import React from 'react'
import Menu from 'components/Menu'
import Container from 'react-bootstrap/Container'
import type {AppProps /*, AppContext*/} from 'next/app'
import {SessionProvider} from 'utils/SessionContext'

function MyApp({Component, pageProps}: AppProps) {
    return <>
            <Head>
                <title>Benjamin Trubert - Photographie</title>
                <link rel="icon" href="/logo.svg"/>
            </Head>
            <SessionProvider>
                <Menu/>
                <Container className="main-content">
                    <Component {...pageProps}/>
                </Container>
            </SessionProvider>
            </>
}


export default MyApp
