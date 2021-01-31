import Loading from "components/loading"
import ProjectView from "components/project"
import MonacoProvider from "components/monaco-provider"
import { getProjectData, getProjectExists } from "lib/database"
import { AuthAction, withAuthUserSSR, withAuthUser } from "next-firebase-auth"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import * as React from "react"
import * as Types from "types"
import { single } from "utils"

interface ProjectFoundPageProps {
  oid: string
  pid: string
  isProject: true
}

interface ProjectNotFoundPageProps {
  isProject: false
}

type ProjectPageProps = ProjectFoundPageProps | ProjectNotFoundPageProps

function ProjectPage(props: ProjectPageProps) {
  if (!props.isProject) return null
  const { oid, pid } = props
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <MonacoProvider>
      {isMounted ? <ProjectView oid={oid} pid={pid} /> : <Loading />}
    </MonacoProvider>
  )
}

export const getServerSideProps = withAuthUserSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProjectPageProps>> {
  const { oid, pid } = context.query

  const { isProject } = await getProjectExists(single(pid), single(oid))

  if (!isProject) {
    context.res.setHeader("Location", `/u/${oid}/p/${pid}/not-found`)
    context.res.statusCode = 307
    return {
      props: { isProject: false },
    }
  }

  return {
    props: {
      oid: single(oid),
      pid: single(pid),
      isProject: true,
    },
  }
})

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADING,
  whenAuthed: AuthAction.RENDER,
  LoaderComponent: Loading,
})(ProjectPage)
