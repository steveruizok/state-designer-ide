import { NextApiResponse, NextApiRequest } from "next"
import admin from "@lib/firebase-admin"

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(400).send({ response: "You need to post to this endpoint." })
    return
  }

  const cookie = req.cookies[process.env.NEXT_PUBLIC_COOKIE_NAME]

  return admin
    .auth()
    .verifySessionCookie(cookie)
    .then(({ sub }) =>
      admin
        .auth()
        .revokeRefreshTokens(sub)
        .then(() => res.status(200).send({ response: "Logged out" }))
    )
    .catch(() => res.status(401).send({ response: "Invalid authentication." }))
}

export const config = {
  api: {
    externalResolver: true,
  },
}
