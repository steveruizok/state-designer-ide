import * as React from "react"
import db from "utils/firestore"
import * as Types from "types"

export default function useUserProjects(uid: string) {
  const [status, setStatus] = React.useState<"error" | "loading" | "ready">(
    "loading",
  )

  const [projects, setProjects] = React.useState<Types.ProjectData[]>([])

  React.useEffect(() => {
    const ref = db.collection("users").doc(uid).collection("projects")

    ref.get().then((snapshot) => {
      setStatus("ready")
      setProjects(
        snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Types.ProjectData),
        ),
      )
    })

    return ref.onSnapshot((snapshot) => {
      setProjects(
        snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Types.ProjectData),
        ),
      )
    })
  }, [uid])

  return { status, projects }
}
