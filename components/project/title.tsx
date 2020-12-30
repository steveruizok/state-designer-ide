import * as React from "react"

import Head from "next/head"
import projectState from "states/project"
import { saveProjectName } from "lib/database"
import { styled } from "components/theme"
import toastState from "states/toast"
import { useStateDesigner } from "@state-designer/react"

interface TitleProps {
  readOnly: boolean
}

export default function Title({ readOnly }: TitleProps) {
  const local = useStateDesigner(projectState)
  const [name, setName] = React.useState(local.data.name)

  const { oid, pid } = local.data

  React.useEffect(() => {
    if (local.data.name !== name) setName(local.data.name)
  }, [local.data.name])

  function handleSave() {
    if (name !== local.data.name) {
      saveProjectName(pid, oid, name)
      toastState.send("ADDED_TOAST", { message: "Renamed Project" })
    }
  }

  return (
    <TitleContainer>
      <Head>
        <title>{name} - State Designer</title>
      </Head>
      <TitleInput
        value={name}
        readOnly={readOnly}
        onChange={(e) => {
          setName(e.currentTarget.value)
        }}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSave()
          }
        }}
      />
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
