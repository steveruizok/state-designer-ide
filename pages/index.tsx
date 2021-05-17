import { Button } from "components/theme"
import useAuthUser from "hooks/useAuthUser"
import Link from "next/link"
import { AuthAction, withAuthUser, withAuthUserSSR } from "next-firebase-auth"
import Router from "next/router"

function Home() {
  const user = useAuthUser()

  if (typeof window !== "undefined" && user.id) {
    Router.push(`/u/${user.id}`)
  }

  return (
    <div>
      <Link href="/auth">
        <a>
          <Button>Sign in</Button>
        </a>
      </Link>
    </div>
  )
}

export const getServerSideProps = withAuthUserSSR({
  whenAuthed: AuthAction.RENDER,
})()

export default withAuthUser()(Home)
