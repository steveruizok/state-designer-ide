import { NextApiRequest, NextApiResponse } from "next"

import captureWebsite from "capture-website"
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
    scaleFactor: 1,
  })

  res.send({ response: "Got screenshot.", src: screenshot })
}

export const config = {
  api: {
    externalResolver: true,
  },
}
