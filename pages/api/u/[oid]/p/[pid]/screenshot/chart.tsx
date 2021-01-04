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
  const {
    query: { oid, pid },
  } = req

  const url = `https://app.state-designer.com/u/${single(oid)}/p/${single(
    pid,
  )}/chart-clean`

  const screenshot = await captureWebsite.base64(url, {
    delay: 1,
  })

  res.send({ response: "Got screenshot.", src: screenshot })
}

export const config = {
  api: {
    externalResolver: true,
  },
}
