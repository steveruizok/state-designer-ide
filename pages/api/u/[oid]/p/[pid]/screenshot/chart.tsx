import { saveProjectSocialScreenshot } from "lib/auth-server"
import { NextApiRequest, NextApiResponse } from "next"
import { single } from "utils"

export default async function sandbox(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    query: { oid, pid },
  } = req

  const url = await saveProjectSocialScreenshot(
    single(oid),
    single(pid),
    "chart",
  )
  res.send({ response: "Saved screenshot.", url })
}

export const config = {
  api: {
    externalResolver: true,
  },
}
