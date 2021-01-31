import { useStateDesigner } from "@state-designer/react"
import Head from "next/head"
import projectState from "states/project"

interface Props {
  oid: string
  pid: string
}

export default function ProjectMeta({ oid, pid }: Props) {
  const { data } = useStateDesigner(projectState)

  const title = data.name ? `${data.name} - State Designer` : `Loading...`
  const DESCRIPTION = "Prototype with an interactive state chart."
  const IMAGE = `https://app.state-designer.com/api/u/${oid}/p/${pid}/screenshot`
  const URL = "https://app.state-designer.com"

  return (
    <Head>
      <title>{title}</title>
      <meta name="og:title" content={title} />
      <meta name="og:description" content={DESCRIPTION} />
      <meta name="og:image" content={IMAGE} />
      <meta name="og:url" content={URL} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={DESCRIPTION} />
      <meta name="twitter:image" content={IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@statedesigner" />
    </Head>
  )
}
