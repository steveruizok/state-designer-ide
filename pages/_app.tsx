import * as React from "react"
import "../styles/globals.css"
import Head from "components/head"
import dynamic from "next/dynamic"
import useRouteChange from "hooks/useRouteChange"
import initAuth from "utils/initAuth"
import MonacoProvider from "components/monaco-provider"

initAuth()

const Dialog = dynamic(() => import("components/dialog"))
const Toast = dynamic(() => import("components/toast"))

function App({ Component, pageProps }) {
  // useRouteChange()

  return (
    <>
      <MonacoProvider>
        <Head />
        <Component {...pageProps} />
        <Toast />
        <Dialog />
      </MonacoProvider>
    </>
  )
}

export default App
