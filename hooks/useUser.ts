import * as React from "react"
import firebase from "@lib/firebase"
import db from "@lib/firestore"
import * as Types from "types"

export default function useProjects(uid: string, pid: string) {
  const [user, setUser] = React.useState<Types.User | null>(null)

  React.useEffect(() => {
    firebase.auth().onIdTokenChanged(async (user) => {
      if (user) {
        setUser({
          name: user.displayName,
          uid: user.uid,
          email: user.email,
          picture: user.photoURL,
        })
        console.log(Date.now() - Date.parse(user.metadata.lastSignInTime))
        setTimeout(() => user.getIdToken(true), 5000)
      } else {
        setUser(null)
      }
    })
  }, [])

  return user
}
