import { GetServerSidePropsContext } from "next"
import { parseCookies } from "nookies"
import admin from "./firebase-admin"
import * as Types from "types"

export async function getAuthState(
  context?: GetServerSidePropsContext
): Promise<Types.AuthState> {
  const state: Types.AuthState = {
    user: null,
    authenticated: false,
    error: "",
  }

  const cookies = parseCookies(context)
  const cookie = cookies[process.env.NEXT_PUBLIC_COOKIE_NAME]

  if (!cookie) return { ...state, error: "No cookie." }

  await admin
    .auth()
    .verifySessionCookie(cookie, true)
    .then(({ name, email, picture, uid }) => {
      state.authenticated = true
      state.user = { name, email, picture, uid }
    })
    .catch(() => {
      state.error = "Could not verify cookie."
    })

  return state
}

export function redirectToAuthPage(context: GetServerSidePropsContext) {
  console.log("re-routing...")
  context.res.writeHead(303, { Location: "/auth" })
  context.res.end()
}

export function redirectToUserPage(context: GetServerSidePropsContext) {
  console.log("re-routing...")
  context.res.writeHead(303, { Location: "/user" })
  context.res.end()
}
