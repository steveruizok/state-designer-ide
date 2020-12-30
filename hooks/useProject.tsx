import * as React from "react"
import * as Types from "types"

import { subscribeToProject } from "lib/database"

export default function useProject(pid: string, oid: string) {
  const [project, setProject] = React.useState<Types.ProjectData>(null)

  React.useEffect(() => {
    let unsub: any
    subscribeToProject(pid, oid, (project) =>
      setProject(project as Types.ProjectData),
    ).then((cb) => (unsub = cb))

    return () => unsub && unsub()
  }, [pid, oid])

  return project
}
