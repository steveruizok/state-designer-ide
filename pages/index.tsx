import { GetServerSideProps } from "next"
import { getAuthState, redirectToUserPage } from "@lib/auth-server"
import { login } from "@lib/auth-client"
import * as Types from "types"

export default function Auth({ error }: Types.AuthState) {
  return (
    <div>
      <h1>Auth</h1>
      <button onClick={login}>Log In</button>
      {error && <p>{error}</p>}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Types.AuthState> = async (
  context
) => {
  const authState = await getAuthState(context)
  if (authState.user) redirectToUserPage(context)
  return { props: authState }
}
