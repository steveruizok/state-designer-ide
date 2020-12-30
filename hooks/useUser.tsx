import * as React from "react"
import * as Types from "types"

import { subscribeToUserAuth } from "lib/database"

export default function useUser() {
  const [user, setUser] = React.useState<Types.User>(null)

  React.useEffect(() => {
    return subscribeToUserAuth(setUser)
  }, [])

  return user
}
