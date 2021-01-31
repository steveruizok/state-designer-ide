import * as React from "react"
import { useAuthUser as _useAuthUser } from "next-firebase-auth"
import authState from "states/auth"

export default function useAuthUser() {
  const user = _useAuthUser()

  React.useEffect(() => {
    authState.send("USER_CHANGED", { user })
  }, [user])

  return user
}
