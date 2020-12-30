import "../styles/globals.css"

import Dialog from "components/dialog"
import MonacoProvider from "components/monaco-provider"
import Toast from "components/toast"

function MyApp({ Component, pageProps }) {
  return (
    <MonacoProvider>
      <Component {...pageProps} />
      <Toast />
      <Dialog />
    </MonacoProvider>
  )
}

export default MyApp
