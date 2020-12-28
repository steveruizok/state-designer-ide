import "../styles/globals.css"

import MonacoProvider from "components/monaco-provider"
import Toast from "components/toast"

function MyApp({ Component, pageProps }) {
  return (
    <MonacoProvider>
      <Component {...pageProps} />
      <Toast />
    </MonacoProvider>
  )
}

export default MyApp
