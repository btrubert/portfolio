import 'bootstrap/dist/css/bootstrap.min.css'
import 'styles/app.scss'
import Head from 'next/head'
import React from 'react'
import Menu from 'components/Menu'
import Container from 'react-bootstrap/Container'
import type { AppProps /*, AppContext*/ } from 'next/app'
import { SessionProvider } from 'utils/SessionContext'
import { TranslationProvider } from 'utils/TranslationContext'

function MyApp({Component, pageProps}: AppProps) {
    return <>
            <Head>
                <link rel="icon" href="/logo.svg"/>
            </Head>
            <SessionProvider>
                <TranslationProvider>
                    <Menu />
                    <Container className="main-content">
                        <Component {...pageProps}/>
                    </Container>
                </TranslationProvider>
            </SessionProvider>
            </>
}


export default MyApp
