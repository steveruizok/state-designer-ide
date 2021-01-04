import Head from "next/head"

interface Props {
  name: string
  oid: string
  pid: string
}

export default function ProjectMeta({ name, oid, pid }: Props) {
  const title = `${name} - State Designer`
  const DESCRIPTION = "Prototype with an interactive state chart."
  const IMAGE = `https://app.state-designer.com/u/${oid}/p/${pid}/screenshot`
  const URL = "https://app.state-designer.com"

  return (
    <Head>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:image" content={IMAGE} />
      <meta property="og:url" content={URL} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={DESCRIPTION} />
      <meta name="twitter:image" content={IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@statedesigner" />
    </Head>
  )
}
