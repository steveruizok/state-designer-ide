import { serialize } from "cookie"
import { NextApiResponse, NextApiRequest } from "next"
import { getFirebaseAdmin } from "@lib/auth-server"

const SESSION_DURATION_IN_DAYS = 14

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  const admin = await getFirebaseAdmin()

  const expiresIn = SESSION_DURATION_IN_DAYS * (24 * 60 * 60 * 1000)

  if (req.method === "POST") {
    var idToken = req.body.token

    const cookie = await admin
      .auth()
      .verifyIdToken(idToken)
      .then((decodedIdToken: any) => {
        if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
          return admin.auth().createSessionCookie(idToken, { expiresIn })
        }
        res.status(401).send("Recent sign in required!")
      })

    if (cookie) {
      const options = {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NEXT_PUBLIC_SECURE_COOKIE === "true",
        path: "/",
      }

      res.setHeader("Set-Cookie", serialize("sd_auth", cookie, options))
    } else {
      res.status(401).end("Invalid authentication")
    }
  } else {
    res.status(400)
    res.send(JSON.stringify({ response: "You need to post to this endpoint." }))
  }
}
