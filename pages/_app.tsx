import "../styles/globals.css"

import MonacoProvider from "components/monaco-provider"
import Head from "next/head"
import dynamic from "next/dynamic"

const Dialog = dynamic(() => import("components/dialog"))
const Toast = dynamic(() => import("components/toast"))

const TITLE = "State Designer"
const DESCRIPTION = "Prototype with an interactive state chart."
const OG_IMAGE = "https://app.state-designer.com/sd-social-og.jpg"
const TW_IMAGE = "https://app.state-designer.com/sd-social-og.jpg"
const URL = "https://app.state-designer.com"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>State Designer</title>
        <meta name="og:title" content={TITLE} />
        <meta name="og:description" content={DESCRIPTION} />
        <meta name="og:image" content={OG_IMAGE} />
        <meta name="og:url" content={URL} />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={TW_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@statedesigner" />
      </Head>
      <MonacoProvider>
        <Component {...pageProps} />
      </MonacoProvider>
      <Toast />
      <Dialog />
    </>
  )
}

export default MyApp
