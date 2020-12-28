// /pages/api/login.tsx

import { serialize } from "cookie"
import admin from "lib/firebase-admin"
import { NextApiRequest, NextApiResponse } from "next"

const SESSION_DURATION_IN_DAYS = 5

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  const expiresIn = SESSION_DURATION_IN_DAYS * (24 * 60 * 60 * 1000)

  if (req.method !== "POST") {
    res.status(400)
    res.send({ response: "You need to post to this endpoint." })
    return
  }

  const [cookie] = req.cookies[process.env.NEXT_PUBLIC_COOKIE_NAME].split("+")

  if (!cookie) {
    res.status(401).send({ response: "Invalid authentication" })
    return
  }

  const decodedClaims = await admin.auth().verifySessionCookie(cookie)
  const customToken = await admin.auth().createCustomToken(decodedClaims.uid)

  const options = {
    maxAge: expiresIn,
    httpOnly: true,
    secure: process.env.NEXT_PUBLIC_SECURE_COOKIE === "true",
    path: "/",
  }

  res.setHeader(
    "Set-Cookie",
    serialize(
      process.env.NEXT_PUBLIC_COOKIE_NAME,
      `${cookie}+${customToken}`,
      options,
    ),
  )

  res.send({ response: "Refreshed token.", customToken })
}

export const config = {
  api: {
    externalResolver: true,
  },
}
