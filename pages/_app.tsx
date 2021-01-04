import "../styles/globals.css"

import Dialog from "components/dialog"
import Toast from "components/toast"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Toast />
      <Dialog />
    </>
  )
}

export default MyApp
