import { saveProjectSocialScreenshot } from "lib/auth-server"
import { NextApiRequest, NextApiResponse } from "next"
import { single } from "utils"

export default async function sandbox(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(400)
    res.send({ response: "You need to post to this endpoint." })
    return
  }

  const oid = req.body.oid.toString()
  const pid = req.body.pid.toString()

  const url = await saveProjectSocialScreenshot(
    single(oid),
    single(pid),
    "chart",
  ).catch((e) => {
    console.log("Could not save project screenshot.")
  })

  res.send({ response: "Saved screenshot.", url })
}

export const config = {
  api: {
    externalResolver: true,
  },
}
