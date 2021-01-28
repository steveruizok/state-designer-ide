import * as React from "react"
import "../styles/globals.css"

import MonacoProvider from "components/monaco-provider"
import Head from "next/head"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import codePanelState from "states/code-panel"

const Dialog = dynamic(() => import("components/dialog"))
const Toast = dynamic(() => import("components/toast"))

const TITLE = "State Designer"
const DESCRIPTION = "Prototype with an interactive state chart."
const OG_IMAGE = "https://app.state-designer.com/sd-social-og.jpg"
const TW_IMAGE = "https://app.state-designer.com/sd-social-og.jpg"
const URL = "https://app.state-designer.com"

function MyApp({ Component, pageProps }) {
  const { asPath, events } = useRouter()

  React.useEffect(() => {
    function handleRouteChange() {
      codePanelState.send("UNLOADED")
    }

    events.on("routeChangeStart", handleRouteChange)
    return () => events.off("routeChangeStart", handleRouteChange)
  }, [])

  const isProjectPath =
    asPath.includes("/p/") &&
    !(
      asPath.endsWith("view") ||
      asPath.endsWith("chart") ||
      asPath.endsWith("clean") ||
      asPath.endsWith("screenshot")
    )

  const image = isProjectPath ? `${asPath}/screenshot` : TW_IMAGE

  return (
    <>
      <Head>
        <title>State Designer</title>
        <meta name="og:title" content={TITLE} />
        <meta name="og:description" content={DESCRIPTION} />
        <meta name="og:image" content={image} />
        <meta name="og:url" content={URL} />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@statedesigner" />
      </Head>
      {isProjectPath ? (
        <MonacoProvider>
          <Component {...pageProps} />
        </MonacoProvider>
      ) : (
        <Component {...pageProps} />
      )}
      <Toast />
      <Dialog />
    </>
  )
}

export default MyApp
