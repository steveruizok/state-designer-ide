import * as React from "react"
import * as Types from "types"

import { getProjectGroups, subscribeToProjects } from "lib/database"

export default function useProjects(oid: string) {
  const [projects, setProjects] = React.useState<Record<
    string,
    Types.ProjectData
  > | null>(null)

  React.useEffect(() => {
    let unsub: any

    getProjectGroups(oid).then(() =>
      subscribeToProjects(oid, (projects) => {
        setProjects(
          projects.reduce((acc, project) => {
            acc[project.id] = project
            return acc
          }, {}),
        )
      }).then((cb) => (unsub = cb)),
    )

    return () => {
      unsub && unsub()
    }
  }, [])

  return projects
}
