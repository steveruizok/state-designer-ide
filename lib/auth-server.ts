import { GetServerSidePropsContext } from "next"
import { parseCookies } from "nookies"
import "firebase/auth"
import pick from "lodash/pick"
import admin from "firebase-admin"
import atob from "atob"

var serviceAccount = JSON.parse(atob(process.env.NEXT_PUBLIC_SERVICE_ACCOUNT))

export async function getFirebaseAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    })
  }

  return admin
}

import * as Types from "types"

async function verifyCookie(
  cookie: string
): Promise<{
  authenticated: boolean
  user: Types.User
}> {
  const admin = await getFirebaseAdmin()
  if (!admin) return null

  let user: any = undefined
  let authenticated: boolean = false

  await admin
    .auth()
    .verifySessionCookie(cookie, true /** checkRevoked */)
    .then((decodedClaims: { [key: string]: any }) => {
      authenticated = true
      user = pick(decodedClaims, "name", "email", "picture", "uid")
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

export async function getCurrentUser(
  context?: GetServerSidePropsContext
): Promise<{ user: Types.User; authenticated: boolean } | null> {
  const cookies = parseCookies(context)

  if (!cookies["sd_auth"]) return null

  const authentication = await verifyCookie(cookies["sd_auth"])

  if (!authentication) return null

  const { user = null, authenticated = false } = authentication

  return {
    user,
    authenticated,
  }
}
