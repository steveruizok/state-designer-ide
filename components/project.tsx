import useProject from "@hooks/useProject"
import * as Types from "types"

export default function Project({ uid, pid }: { uid: string; pid: string }) {
  const { project, update } = useProject(uid, pid)

  if (!project) return <div>Loading...</div>

  return (
    <div>
      <input
        value={project.name}
        onChange={(e) => update({ name: e.currentTarget.value })}
      />{" "}
      <pre>{JSON.stringify(project, null, "  ")}</pre>
    </div>
  )
}
