import "../styles/globals.css"
import Toast from "../components/toast"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Toast />
    </>
  )
}

export default MyApp
