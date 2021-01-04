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

  const path = `/u/${single(oid)}/p/${single(pid)}/clean`
  const url = process.env.NEXT_PUBLIC_BASE_API_URL + path

  const screenshot = await captureWebsite.base64(url)

  // const screenshot = await captureWebsite.file(
  //   url,
  //   `/u/${single(oid)}/p/${single(pid)}.png`,
  // )

  res.send({ response: "Got screenshot.", url: screenshot })
}

export const config = {
  api: {
    externalResolver: true,
  },
}
