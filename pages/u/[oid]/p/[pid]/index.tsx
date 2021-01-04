import * as React from "react"
import * as Types from "types"

import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { getProjectData, getProjectExists } from "lib/database"

import Loading from "components/loading"
import ProjectMeta from "components/project-meta"
import dynamic from "next/dynamic"
import { getCurrentUser } from "lib/auth-server"
import { single } from "utils"

const ProjectView = dynamic(() => import("components/project"))

interface ProjectFoundPageProps {
  oid: string
  pid: string
  uid?: string
  user: Types.User
  token?: string
  isOwner?: boolean
  isProject: true
  projectData: Types.ProjectData
}

interface ProjectNotFoundPageProps {
  isProject: false
}

type ProjectPageProps = ProjectFoundPageProps | ProjectNotFoundPageProps

export default function ProjectPage(props: ProjectPageProps) {
  if (!props.isProject) return null
  const { oid, pid, uid, user, token, isOwner, projectData } = props
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted ? (
    <>
      <ProjectMeta name={projectData.name || ""} oid={oid} pid={pid} />
      <ProjectView
        oid={oid}
        pid={pid}
        uid={uid}
        user={user}
        token={token}
        isOwner={isOwner}
        projectData={projectData}
      />
    </>
  ) : (
    <Loading />
  )
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProjectPageProps>> {
  const { oid, pid } = context.query

  const authState = await getCurrentUser(context)

  const uid = authState.authenticated ? authState.user.uid : null

  const { isProject } = await getProjectExists(single(pid), single(oid), uid)

  if (!isProject) {
    context.res.setHeader("Location", `/u/${oid}/p/${pid}/not-found`)
    context.res.statusCode = 307
    return {
      props: { isProject: false },
    }
  }

  const projectData = await getProjectData(single(pid), single(oid))

  if (projectData) {
    ;(projectData as any).timestamp = null
  }

  return {
    props: {
      oid: single(oid),
      pid: single(pid),
      uid,
      user: authState.user,
      token: authState.token,
      isOwner: oid === uid,
      isProject: true,
      projectData,
    },
  }
}
