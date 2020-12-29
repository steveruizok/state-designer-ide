import { getCurrentUser } from "lib/auth-server"
import { getProjectData, getProjectExists } from "lib/database"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import * as React from "react"
import * as Types from "types"
import { single } from "utils"

interface ProjectNotFoundPageProps {
  oid: string
  pid: string
  uid?: string
  user: Types.User
  token?: string
}

export default function ProjectNotFoundPage({
  oid,
  pid,
  uid,
  user,
  token,
}: ProjectNotFoundPageProps) {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted ? <div>Not found. Make one?</div> : <div>Loading...</div>
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProjectNotFoundPageProps>> {
  const { oid, pid } = context.query

  const authState = await getCurrentUser(context)
    .then((d) => d)
    .catch((e) => {
      throw Error("Oh no " + e.message)
    })

  const uid = authState.authenticated ? authState.user.uid : null

  return {
    props: {
      oid: single(oid),
      pid: single(pid),
      uid,
      user: authState.user,
      token: authState.token,
    },
  }
}
