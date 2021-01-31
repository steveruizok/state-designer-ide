import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import * as React from "react"

interface ProjectNotFoundPageProps {}

export default function ProjectNotFoundPage({}: ProjectNotFoundPageProps) {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted ? <div>Not found. Make one?</div> : <div>Loading...</div>
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProjectNotFoundPageProps>> {
  return {
    props: {},
  }
}
