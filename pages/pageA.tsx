import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import Link from "next/link"
import { logout } from "@lib/auth-client"
import { getCurrentUser } from "@lib/auth-server"
import * as Types from "types"

export default function PageA({ user }: Types.AuthState) {
  return (
    <div>
      <h1>Page A</h1>
      <img src={user.picture} />
      <h2>Server user</h2>
      <pre>{JSON.stringify(user, null, "  ")}</pre>
      <button onClick={logout}>Logout</button>
      <Link href={"/user"}>
        <a>User</a>
      </Link>
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
