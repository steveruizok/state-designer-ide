import { GetServerSideProps } from "next"
import { getAuthState, redirectToAuthPage } from "@lib/auth-server"
import { logout } from "@lib/auth-client"
import * as Types from "types"

export default function User({ user }: Types.AuthState) {
  return (
    <div>
      <h1>User</h1>
      <img src={user.picture} />
      <pre>{JSON.stringify(user, null, "  ")}</pre>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Types.AuthState> = async (
  context
) => {
  const authState = await getAuthState(context)
  if (!authState.authenticated) redirectToAuthPage(context)
  return { props: authState }
}
