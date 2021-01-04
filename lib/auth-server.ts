import fs from "fs"

import captureWebsite from "capture-website"
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
      authenticated = true
    })
    .catch(() => {
      console.log("Could not authenticate!")
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
  const cookie = cookies[process.env.NEXT_PUBLIC_COOKIE_NAME]

  if (!cookie) {
    result.error = "No cookie."
    return result
  }

  const [sessionCookie, customToken] = cookie.split("+")

  const authentication = await verifyCookie(sessionCookie).catch((e) => {
    console.log("Could not verify session cookie!")
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

export async function saveProjectSocialScreenshot(
  oid: string,
  pid: string,
  page: "view" | "chart",
) {
  const url = `https://app.state-designer.com/u/${oid}/p/${pid}/${page}-clean`
  // const location = process.cwd() + `/public/screenshots/${oid}-${pid}.jpg`
  const buffer = await captureWebsite.buffer(url, { delay: 1 })
  const binaryData = buffer.toString("binary")

  const file = admin.storage().bucket().file(`screenshots/${oid}-${pid}.jpg`)
  await file.save(binaryData, { contentType: "image/jpeg" })
  await file.makePublic()
  return file.publicUrl()
}
