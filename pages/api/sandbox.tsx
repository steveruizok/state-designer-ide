import { NextApiRequest, NextApiResponse } from "next"

import admin from "lib/firebase-admin"
import getCodeSandboxUrl from "lib/codesandbox"
import { getProjectData } from "lib/database"
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

  const project = await getProjectData(pid, oid)

  const url = await getCodeSandboxUrl(project)

  res.send({ response: "Got code sandbox link.", url })
}

export const config = {
  api: {
    externalResolver: true,
  },
}
