import { NextApiRequest } from "next"
/* globals window */

export default function (url: string, req?: NextApiRequest) {
  // Hosted
  if (req) {
    return `https://${req.headers.host}${url}`
  }

  // Local
  if (typeof window === "undefined") {
    throw new Error(
      'The "req" parameter must be provided if on the server side.',
    )
  }
  return `http://${window.location.host}${url}`
}
