import "../styles/globals.css"

import Dialog from "components/dialog"
import Toast from "components/toast"
import Head from "next/head"

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
        <meta key="og:title" property="og:title" content={TITLE} />
        <meta
          key="og:description"
          property="og:description"
          content={DESCRIPTION}
        />
        <meta key="og:image" property="og:image" content={OG_IMAGE} />
        <meta key="og:url" property="og:url" content={URL} />
        <meta key="twitter:title" name="twitter:title" content={TITLE} />
        <meta
          key="twitter:description"
          name="twitter:description"
          content={DESCRIPTION}
        />
        <meta key="twitter:image" name="twitter:image" content={TW_IMAGE} />
        <meta
          key="twitter:card"
          name="twitter:card"
          content="summary_large_image"
        />
        <meta key="twitter:site" name="twitter:site" content="@statedesigner" />
      </Head>
      <Component {...pageProps} />
      <Toast />
      <Dialog />
    </>
  )
}

export default MyApp
