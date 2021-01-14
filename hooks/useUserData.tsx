import * as React from "react"
import * as Types from "types"

import {
  getProjectGroups,
  getProjectIds,
  subscribeToUserChanges,
} from "lib/database"

export default function useUserData(oid: string) {
  const [user, setUser] = React.useState<
    Types.User & { groups: Types.ProjectGroups }
  >(null)

  React.useEffect(() => {
    let unsub: any

    getProjectGroups(oid).then(() =>
      subscribeToUserChanges(oid, async (d) => {
        setUser(d)
      }).then((cb) => (unsub = cb)),
    )

    return () => {
      unsub && unsub()
    }
  }, [oid])

  return user
}
