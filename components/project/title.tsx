import { useStateDesigner } from "@state-designer/react"
import { styled } from "components/theme"
import { saveProjectName } from "lib/database"
import Head from "next/head"
import * as React from "react"
import projectState from "states/project"

interface TitleProps {
  readOnly: boolean
}

export default function Title({ readOnly }: TitleProps) {
  const local = useStateDesigner(projectState)
  const [name, setName] = React.useState(local.data.name)
  React.useEffect(() => {
    if (local.data.name !== name) setName(local.data.name)
  }, [local.data.name])

  return (
    <TitleContainer>
      <Head>
        <title>{name} - State Designer</title>
      </Head>
      <TitleInput
        value={name}
        readOnly={readOnly}
        onChange={(e) => {
          const { oid, pid } = local.data
          setName(e.currentTarget.value)
          saveProjectName(pid, oid, e.currentTarget.value)
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
