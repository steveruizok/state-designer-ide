import { NextApiResponse, NextApiRequest } from "next"
import { serialize } from "cookie"
import admin from "@lib/firebase-admin"

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(400).send({ response: "You need to post to this endpoint." })
    return
  }

  const idToken = req.body.token.toString()
  const expiresIn = 5 * (24 * 60 * 60 * 1000)

  return admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then((cookie) => {
      res.setHeader(
        "Set-Cookie",
        serialize(process.env.NEXT_PUBLIC_COOKIE_NAME, cookie, {
          maxAge: expiresIn,
          httpOnly: true,
          secure: false,
          path: "/",
        })
      )
      res.status(200).send({ response: "Logged in." })
    })
    .catch(() => res.status(401).send({ response: "Invalid authentication." }))
}

export const config = {
  api: {
    externalResolver: true,
  },
}
