import { NextApiRequest, NextApiResponse } from "next"

import admin from "lib/firebase-admin"
import captureWebsite from "capture-website"
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

  const path = `/u/${oid}/p/${pid}/clean`
  const url = process.env.NEXT_PUBLIC_BASE_API_URL + path

  const screenshot = await captureWebsite.base64(url)

  console.log("hello screenshot", screenshot)

  res.send({ response: "Got screenshot.", url: screenshot })
}

export const config = {
  api: {
    externalResolver: true,
  },
}
