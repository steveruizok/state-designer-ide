import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { getCurrentUser } from "lib/auth-server"
import { getProjectData, getProjectInfo } from "lib/database"
import * as Types from "types"
import { single } from "utils"
import ProjectView from "components/project"

interface ProjectPageProps {
  authState: Types.AuthState
  projectResponse: Types.ProjectResponse
}

export default function ProjectPage({
  authState: { user, authenticated },
  projectResponse: { pid, oid, isOwner },
}: ProjectPageProps) {
  return (
    <ProjectView
      pid={pid}
      oid={oid}
      user={user}
      isOwner={isOwner}
      authenticated={authenticated}
    />
  )
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ProjectPageProps>> {
  const { oid, pid } = context.query

  const authState = await getCurrentUser(context)
    .then((d) => d)
    .catch((e) => {
      throw Error("Oh no " + e.message)
    })

  const uid = authState.authenticated ? authState.user.uid : null
  const projectResponse = await getProjectInfo(single(pid), single(oid), uid)

  return {
    props: { authState, projectResponse },
  }
}
