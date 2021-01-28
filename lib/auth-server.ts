import * as Types from "types"

import { GetServerSidePropsContext } from "next"
import admin from "./firebase-admin"
import { parseCookies } from "nookies"
import pick from "lodash/pick"

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
      authenticated = true
    })
    .catch(() => {
      // console.log("Could not authenticate!")
      authenticated = false
      return {
        authenticated,
        user,
      }
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

export async function updateUserToken() {}

export async function getCurrentUser(
  context?: GetServerSidePropsContext,
): Promise<Types.AuthState> {
  const result = {
    token: "",
    user: null,
    authenticated: false,
    error: "",
  }

  const cookies = parseCookies(context)
  const sessionCookie = cookies[process.env.NEXT_PUBLIC_COOKIE_NAME]
  const customToken = cookies[process.env.NEXT_PUBLIC_TOKEN_NAME]

  if (!sessionCookie) {
    result.error = "No session cookie."
    return result
  }

  if (!customToken) {
    result.error = "No custom token."
    return result
  }

  const authentication = await verifyCookie(sessionCookie).catch((e) => {
    // console.log("Could not verify session cookie!")
  })

  if (!authentication) {
    result.error = "Could not verify session cookie."
    return result
  }

  const { user = null, authenticated = false } = authentication

  result.token = customToken || null
  result.user = user
  result.authenticated = authenticated

  return result
}
