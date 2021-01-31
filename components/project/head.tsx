import NextHead from "next/head"
import { useRouter } from "next/router"

const TITLE = "State Designer"
const DESCRIPTION = "Prototype with an interactive state chart."
const IMAGE = "https://app.state-designer.com/sd-social-og.jpg"
const URL = "https://app.state-designer.com"

export default function Head() {
  const { asPath } = useRouter()
  const image = asPath.includes("/p/")
    ? `${process.env.NEXT_PUBLIC_BASE_API_URL}/api${asPath}/screenshot`
    : IMAGE

  return (
    <NextHead>
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
    </NextHead>
  )
}
