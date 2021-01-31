import getCodeSandboxUrl from "lib/codesandbox"
import { single } from "utils"
import * as Types from "types"
import db from "utils/firestore"
import { NextApiRequest, NextApiResponse } from "next"

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

  const doc = await db
    .collection("users")
    .doc(single(oid))
    .collection("projects")
    .doc(single(pid))
    .get()

  if (doc.exists) {
    res.send({ response: "Could not find that project." })
    return
  }

  const url = await getCodeSandboxUrl({
    id: doc.id,
    ...doc.data(),
  } as Types.ProjectData)

  res.send({ response: "Got code sandbox link.", url })
}

export const config = {
  api: {
    externalResolver: true,
  },
}
