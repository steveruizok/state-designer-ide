import { AuthAction, withAuthUserSSR, withAuthUser } from "next-firebase-auth"
import { GetServerSidePropsContext } from "next"
import * as React from "react"
import { single } from "utils"
import db from "utils/firestore"
import Loading from "components/loading"
import ProjectView from "components/project"
import useAuthUser from "hooks/useAuthUser"

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
  const user = useAuthUser()

  if (!props.isProject) return null

  const { oid, pid } = props

  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true))

  return mounted ? <ProjectView oid={oid} pid={pid} /> : <Loading />
}

export const getServerSideProps = withAuthUserSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async function getServerSideProps(context: GetServerSidePropsContext) {
  const { oid, pid } = context.query

  const project = await db
    .collection("users")
    .doc(single(oid))
    .collection("projects")
    .doc(single(pid))
    .get()

  if (!project.exists) {
    context.res.setHeader("Location", `/u/${oid}/p/${pid}/not-found`)
    context.res.statusCode = 307
    return {
      props: { isProject: false },
    }
  }

  return {
    oid: single(oid),
    pid: single(pid),
    isProject: true,
  }
})

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADING,
  whenAuthed: AuthAction.RENDER,
  LoaderComponent: Loading,
})(ProjectPage)
