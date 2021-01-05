import { NextApiRequest, NextApiResponse } from "next"

import captureWebsite from "capture-website"

export default async function sandbox(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    query: { oid, pid, page = "chart" },
  } = req

  const url = `https://app.state-designer.com/u/${oid}/p/${pid}/${page.toString()}-clean`

  const buffer = await captureWebsite.buffer(url, {
    width: 1200,
    height: 630,
    delay: 2,
    scaleFactor: 1,
  })

  res.status(200).end(buffer)
  return {}
}
