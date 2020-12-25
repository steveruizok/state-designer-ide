import "../styles/globals.css"
import Toast from "../components/toast"
import MonacoProvider from "../components/monaco-provider"

function MyApp({ Component, pageProps }) {
  return (
    <MonacoProvider>
      <Component {...pageProps} />
      <Toast />
    </MonacoProvider>
  )
}

export default MyApp
