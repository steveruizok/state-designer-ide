import pick from "lodash/pick"
import { GetServerSidePropsContext } from "next"
import { parseCookies } from "nookies"
import * as Types from "types"

import admin from "./firebase-admin"

export async function verifyCookie(
  cookie: string,
): Promise<{
  authenticated: boolean
  user: Types.User
}> {
  if (!admin) return null

  let user: any = undefined
  let authenticated: boolean = false

  await admin
    .auth()
    .verifySessionCookie(cookie, true /** checkRevoked */)
    .then((decodedClaims: { [key: string]: any }) => {
      user = pick(decodedClaims, "name", "email", "picture", "uid")
      user.authenticated = true
      authenticated = true
    })
    .catch(() => {
      authenticated = false
    })

  return {
    authenticated,
    user,
  }
}
// Public API

export function redirectToAuthPage(context: GetServerSidePropsContext) {
  context.res.writeHead(303, { Location: "/auth" })
  context.res.end()
  return null
}

export function redirectToUserPage(
  context: GetServerSidePropsContext,
  uid: string,
) {
  context.res.writeHead(303, { Location: `/u/${uid}` })
  context.res.end()
  return null
}

export function redirectToNotFoundPage(context: GetServerSidePropsContext) {
  context.res.writeHead(303, { Location: "/404" })
  context.res.end()
  return null
}

export async function getCurrentUser(
  context?: GetServerSidePropsContext,
): Promise<Types.AuthState> {
  const cookies = parseCookies(context)
  const [cookie, customToken] = cookies[
    process.env.NEXT_PUBLIC_COOKIE_NAME
  ]?.split("+")

  const result = {
    token: "",
    user: null,
    authenticated: false,
    error: "",
  }

  if (!cookie) {
    result.error = "No cookie."
    return result
  }

  const authentication = await verifyCookie(cookie)

  if (!authentication) {
    result.error = "Could not verify cookie."
    return result
  }

  const { user = null, authenticated = false } = authentication

  result.token = customToken
  result.user = user
  result.authenticated = authenticated

  return result
}
