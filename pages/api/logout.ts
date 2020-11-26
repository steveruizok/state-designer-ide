import { NextApiResponse, NextApiRequest } from "next"
import { getFirebaseAdmin } from "@lib/auth-server"

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const admin = await getFirebaseAdmin()
  if (req.method === "POST") {
    const cookie = req.cookies["sd_auth"]

    return admin
      .auth()
      .verifySessionCookie(cookie)
      .then((decodedClaims: any) =>
        admin
          .auth()
          .revokeRefreshTokens(decodedClaims.sub)
          .then(() => {
            res.status(200)
            res.end(JSON.stringify({ response: "Logged out" }))
          })
      )
      .catch((error: Error) => {
        res.status(400)
        res.end(JSON.stringify({ response: "Error! " + error.message }))
      })
  } else {
    res.status(400)
    res.end(JSON.stringify({ response: "You need to post to this endpoint." }))
  }
}
