import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"

import { Button } from "components/theme"
import { getCurrentUser } from "lib/auth-server"
import { login } from "lib/auth-client"

export default function Home() {
  return (
    <div>
      <Button onClick={login}>Log in</Button>
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const authState = await getCurrentUser(context)

  if (authState.user) {
    context.res.setHeader("Location", `/u/${authState.user.uid}`)
    context.res.statusCode = 307
  } else {
    if (!authState.authenticated) {
      context.res.setHeader("Location", `/u/auth`)
      context.res.statusCode = 307
    }
  }

  return {
    props: authState,
  }
}
