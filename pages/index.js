import { Button } from "components/theme"
import { login } from "lib/auth-client"
import { getCurrentUser } from "lib/auth-server"

export default function Home() {
  return (
    <div>
      <Button onClick={login}>Log in</Button>
    </div>
  )
}

export async function getServerSideProps(context) {
  const authState = await getCurrentUser(context)

  if (authState.user) {
    context.res.setHeader("Location", `/u/${authState.user.uid}`)
    context.res.statusCode = 307
  }

  return {
    props: authState,
  }
}
