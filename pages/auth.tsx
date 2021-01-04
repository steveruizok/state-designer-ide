import GeneralMeta from "components/general-meta"
import { Button } from "components/theme"
import { login } from "lib/auth-client"
import { getCurrentUser } from "lib/auth-server"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import * as Types from "types"

export default function Auth({ error }: Types.AuthState) {
  return (
    <div>
      <GeneralMeta />
      <Button onClick={login}>Log in</Button>
    </div>
  )
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<Types.AuthState>> {
  const authState = await getCurrentUser(context)

  if (authState.user) {
    context.res.setHeader("Location", `/u/${authState.user.uid}`)
    context.res.statusCode = 307
  }

  return {
    props: authState,
  }
}
