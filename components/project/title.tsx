import * as React from "react"

import { Button, styled } from "components/theme"

import Head from "next/head"
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
      <Head>
        <title>{project?.name} - State Designer</title>
      </Head>
      <Button
        onClick={() =>
          dialogState.send("OPENED_PROJECT_RENAME_DIALOG", {
            project,
          })
        }
      >
        {project?.name}
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

const TitleInput = styled.input({
  px: "$2",
  py: "$0",
  fontFamily: "$body",
  fontSize: "$1",
  fontWeight: "bold",
  color: "$text",
  bg: "transparent",
  border: "none",
  textAlign: "center",
  outline: "none",
  "&:focus": {
    bg: "$shadow",
  },
})
