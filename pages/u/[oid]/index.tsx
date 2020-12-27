import { styled } from "components/theme"
import { logout } from "lib/auth-client"
import { getCurrentUser, redirectToAuthPage } from "lib/auth-server"
import { getUserProjects } from "lib/database"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import Link from "next/link"
import { AuthState, UserProjectsResponse } from "types"

interface UserPageProps {
  authState: AuthState
  data: UserProjectsResponse
}

export default function UserPage({ authState, data }: UserPageProps) {
  return (
    <Layout>
      <pre>
        <code>{JSON.stringify(authState, null, 2)}</code>
      </pre>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
      <ul>
        {data.projects.map((pid) => (
          <li key={pid}>
            <Link href={`/u/${data.oid}/p/${pid}`}>
              <a>{pid}</a>
            </Link>
          </li>
        ))}
      </ul>
      <button onClick={() => logout("/")}>Logout</button>
    </Layout>
  )
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<UserPageProps>> {
  const authState = await getCurrentUser(context)

  if (!authState.authenticated) {
    redirectToAuthPage(context)
    return
  }

  const { uid } = authState.user
  const data = await getUserProjects(uid, uid)

  return {
    props: { authState, data },
  }
}

const Layout = styled.div({
  display: "grid",
})
