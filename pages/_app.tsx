import "../styles/globals.css"
import Toast from "../components/toast"
import React from "react"
import { CustomMonacoProvider } from "../components/monaco-provider"

function MyApp({ Component, pageProps }) {
  return (
    <CustomMonacoProvider>
      <Component {...pageProps} />
      <Toast />
    </CustomMonacoProvider>
  )
}

export default MyApp
