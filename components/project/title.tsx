import * as React from "react"

import { Button, styled } from "components/theme"

import dialogState from "states/dialog"
import useProject from "hooks/useProject"

interface TitleProps {
  readOnly: boolean
  oid: string
  pid: string
}

export default function Title({ oid, pid, readOnly }: TitleProps) {
  const project = useProject(pid, oid)

  return (
    <TitleContainer>
      <Button
        title="Rename Project"
        onClick={() =>
          !readOnly &&
          dialogState.send("OPENED_PROJECT_RENAME_DIALOG", {
            project,
          })
        }
      >
        {project?.name || "Loading"}
      </Button>
    </TitleContainer>
  )
}

const TitleContainer = styled.div({
  gridArea: "title",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
})
