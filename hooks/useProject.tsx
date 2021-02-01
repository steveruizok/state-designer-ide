import * as React from "react"
import * as Types from "types"
import db from "utils/firestore"

export default function useProject(pid: string, oid: string) {
  const [status, setStatus] = React.useState<"loading" | "error" | "ready">(
    null,
  )
  const [project, setProject] = React.useState<Types.ProjectData>(null)

  React.useEffect(() => {
    let unsub: () => void

    const docRef = db
      .collection("users")
      .doc(oid)
      .collection("projects")
      .doc(pid)

    docRef.get().then((doc) => {
      if (!doc.exists) {
        setStatus("error")
      }
      setStatus("ready")
      setProject({ id: doc.id, ...doc.data() } as Types.ProjectData)

      unsub = docRef.onSnapshot((doc) =>
        setProject({ id: doc.id, ...doc.data() } as Types.ProjectData),
      )
    })

    return () => {
      setProject(null)
      unsub?.()
    }
  }, [pid, oid])

  return { status, project }
}
