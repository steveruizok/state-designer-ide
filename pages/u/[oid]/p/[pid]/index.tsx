import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { getCurrentUser } from "lib/auth-server"
import { getProjectData, getProjectInfo } from "lib/database"
import * as Types from "types"
import { single } from "utils"
import dynamic from "next/dynamic"
const ProjectView = dynamic(() => import("components/project"))

interface ProjectPageProps {
  authState: Types.AuthState
  projectResponse: Types.ProjectResponse
  projectData: Types.ProjectData
}

export default function ProjectPage({
  authState: { user, authenticated },
  projectResponse: { pid, oid, isOwner },
  projectData,
}: ProjectPageProps) {
  return (
    <ProjectView
      pid={pid}
      oid={oid}
      user={user}
      isOwner={isOwner}
      authenticated={authenticated}
      project={projectData}
    />
  )
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProjectPageProps>> {
  const { oid, pid } = context.query

  const authState = await getCurrentUser(context)
    .then((d) => d)
    .catch((e) => {
      throw Error("Oh no " + e.message)
    })

  const uid = authState.authenticated ? authState.user.uid : null
  const projectResponse = await getProjectInfo(single(pid), single(oid), uid)
  const projectData = await getProjectData(single(pid), single(oid))
  if (projectData) {
    ;(projectData as any).timestamp = null
  }

  return {
    props: { authState, projectResponse, projectData },
  }
}
