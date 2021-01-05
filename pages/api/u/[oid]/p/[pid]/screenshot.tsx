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

  const buffer = await captureWebsite
    .buffer(url, {
      width: 1200,
      height: 630,
      delay: 2,
      scaleFactor: 1,
    })
    .catch((e) => {
      res.send({ message: "Could not get screenshot image. " + e.message })
      return
    })

  res.setHeader("Cache-Control", "s-maxage=300000, stale-while-revalidate")
  res.setHeader("Content-Type", "image/png")
  res.send(buffer)
}
