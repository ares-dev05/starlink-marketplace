import '../styles/globals.css'

import { COOKIE_NAME, NETWORK, SESSION_PASSWORD } from '../utils/const'

import App from 'next/app'
import AppStyles from '../components/Style'
import { ChakraProvider } from '@chakra-ui/react'
import Layout from '../components/Layout'
import { SignedUserWrapper } from '../context/signed-user'
import { UseWalletProvider } from 'use-wallet'
import { applySession } from 'next-iron-session'
import theme from '../theme/index'

function MyApp({ Component, pageProps, signedUser }) {
    return (
        <UseWalletProvider
            chainId={NETWORK === 'mainnet' ? 1 : 4}
            connectors={{
                walletconnect: {
                    rpcUrl: 'https://mainnet.infura.io/v3/16d62dee5d09404dac52b6933c58a000',
                },
                fortmatic: { apiKey: 'pk_live_6D08A510AD752EA5' },
                portis: { dAppId: 'f67b5688-d623-4826-8f2c-160b51a09b38' },
                walletlink: {
                    url: 'https://mainnet.infura.io/v3',
                    appName: 'starlink-marketplace',
                },
            }}
        >
            <ChakraProvider theme={theme}>
                <SignedUserWrapper signedUser={signedUser}>
                    <Layout
                        justify={Component.justify}
                        noBackground={Component.noBackground}
                    >
                        <AppStyles />
                        <Component {...pageProps} />
                    </Layout>
                </SignedUserWrapper>
            </ChakraProvider>
        </UseWalletProvider>
    )
}

MyApp.getInitialProps = async (appContext) => {
    const appProps = await App.getInitialProps(appContext)
    const req = appContext.ctx.req
    const res = appContext.ctx.res
    if (!req) {
        return {
            ...appProps,
            signedUser: null,
        }
    }
    await applySession(req, res, {
        password: SESSION_PASSWORD,
        cookieName: COOKIE_NAME,
    })
    return {
        ...appProps,
        signedUser: req.session.get('user') || null,
    }
}

export default MyApp
