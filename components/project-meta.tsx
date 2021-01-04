import Head from "next/head"

interface Props {
  name: string
  oid: string
  pid: string
}

export default function ProjectMeta({ name, oid, pid }: Props) {
  const title = `${name} - State Designer`
  const DESCRIPTION = "Prototype with an interactive state chart."
  const IMAGE = `https://storage.googleapis.com/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/screenshots/${oid}-${pid}.jpg`
  const URL = "https://app.state-designer.com"

  return (
    <Head>
      <title>{title}</title>
      <meta key="og:title" property="og:title" content={title} />
      <meta
        key="og:description"
        property="og:description"
        content={DESCRIPTION}
      />
      <meta key="og:image" property="og:image" content={IMAGE} />
      <meta key="og:url" property="og:url" content={URL} />
      <meta key="twitter:title" name="twitter:title" content={title} />
      <meta
        key="twitter:description"
        name="twitter:description"
        content={DESCRIPTION}
      />
      <meta key="twitter:image" name="twitter:image" content={IMAGE} />
      <meta
        key="twitter:card"
        name="twitter:card"
        content="summary_large_image"
      />
      <meta key="twitter:site" name="twitter:site" content="@statedesigner" />
    </Head>
  )
}
