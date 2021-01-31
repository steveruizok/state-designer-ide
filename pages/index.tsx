import { Button } from "components/theme"
import Link from "next/link"
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth"
import Router from "next/router"

function Home() {
  const AuthUser = useAuthUser()

  if (typeof window !== "undefined" && AuthUser.id) {
    Router.push(`/u/${AuthUser.id}`)
  }

  return (
    <div>
      <pre>{JSON.stringify(AuthUser, null, 2)}</pre>
      <Link href="/auth">
        <a>
          <Button>Sign in</Button>
        </a>
      </Link>
    </div>
  )
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.Render,
})(async ({ AuthUser }) => {
  // Redirect to user page?
  return { uid: AuthUser.id }
})

export default withAuthUser()(Home)
