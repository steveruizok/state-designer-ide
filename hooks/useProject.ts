import * as React from "react"
import db from "@lib/firestore"

export default function useProjects(uid: string, pid: string) {
  const [state, setState] = React.useState<any>()

  React.useEffect(() => {
    return db
      .collection("users")
      .doc(uid)
      .collection("projects")
      .doc(pid)
      .onSnapshot((doc) => {
        if (!doc.exists) return
        setState(doc.data())
      })
  }, [])

  function update(changes: { [key: string]: any }) {
    const user = db.app.auth().currentUser
    if (user.uid !== uid) return

    console.log(
      (Date.now() - Date.parse(user.metadata.lastSignInTime)) / 1000 / 60
    )
    // setTimeout(() => user.getIdToken(true), 5000)

    db.collection("users")
      .doc(uid)
      .collection("projects")
      .doc(pid)
      .update(changes)
  }

  return { project: state, update }
}
