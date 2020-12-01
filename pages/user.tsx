import { GetServerSideProps } from "next"
import dynamic from "next/dynamic"
import { getAuthState, redirectToAuthPage } from "@lib/auth-server"
import { logout } from "@lib/auth-client"
import { getUserProjects } from "@lib/firestore"
import useProject from "@hooks/useProject"
import * as Types from "types"

const Project = dynamic(() => import("@components/project"), { ssr: false })

export default function User({
  user,
  projects,
}: Types.AuthState & { projects: string[] }) {
  const projs = projects.map((p) => JSON.parse(p))
  return (
    <div>
      <h1>User</h1>
      <img src={user.picture} />
      <pre>{JSON.stringify(user, null, "  ")}</pre>
      <ul>
        {projs.map((proj) => (
          <li key={proj.id}>
            <Project uid={user.uid} pid={proj.id} />
          </li>
        ))}
      </ul>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Types.AuthState> = async (
  context
) => {
  const authState = await getAuthState(context)
  if (!authState.authenticated) redirectToAuthPage(context)
  const projects = await getUserProjects(authState.user.uid)
  return { props: { ...authState, projects } }
}
