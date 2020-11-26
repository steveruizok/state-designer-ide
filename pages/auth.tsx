import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { getCurrentUser } from "@lib/auth-server"
import { login, logout } from "@lib/auth-client"
import * as Types from "types"

export default function Auth({ user, authenticated }: Types.AuthState) {
  return (
    <div>
      <h1>Auth</h1>
      <div>
        <button onClick={login}>Log In</button>

        <button onClick={logout}>Log Out</button>
      </div>
      <h2>User</h2>
      <pre>{JSON.stringify(user, null, "  ")}</pre>
      <h2>Authenticated</h2>
      <pre>{authenticated ? "true" : "false"}</pre>
    </div>
  )
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Types.AuthState>> {
  const { user, authenticated } = await getCurrentUser(context)

  return {
    props: { user, authenticated },
  }
}
