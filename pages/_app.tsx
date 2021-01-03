import "../styles/globals.css"

import Dialog from "components/dialog"
import MonacoProvider from "components/monaco-provider"
import Toast from "components/toast"
import Head from "next/head"

const TITLE = "State Designer"
const DESCRIPTION = "Prototype with an interactive state chart."
const OG_IMAGE = "/sd-social-og.jpg"
const TW_IMAGE = "/sd-social-og.jpg"
const URL = "https://app.state-designer.com"

function MyApp({ Component, pageProps }) {
  return (
    <MonacoProvider>
      <Head>
        <title>State Designer</title>
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:url" content={URL} />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={TW_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Component {...pageProps} />
      <Toast />
      <Dialog />
    </MonacoProvider>
  )
}

export default MyApp
