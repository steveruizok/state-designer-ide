import { IconButton, Text, styled } from "components/theme"
import useTheme from "hooks/useTheme"
import { forkProject } from "lib/database"
import { Copy, Minus, Plus, Sun } from "react-feather"
import codePanelState from "states/code-panel"

interface ControlsProps {
  oid: string
  pid: string
  uid?: string
  isAuthenticated?: boolean
}

export default function Controls({
  oid,
  pid,
  uid,
  isAuthenticated,
}: ControlsProps) {
  const { toggle } = useTheme()
  console.log(pid, oid, uid)
  return (
    <ControlsContainer>
      {isAuthenticated && (
        <IconButton onClick={() => forkProject(pid, oid, uid)}>
          {!(oid === pid) && <Text variant="ui">Copy Project</Text>}
          <Copy />
        </IconButton>
      )}
      <IconButton onClick={() => codePanelState.send("DECREASED_FONT_SIZE")}>
        <Minus />
      </IconButton>
      <IconButton onClick={() => codePanelState.send("INCREASED_FONT_SIZE")}>
        <Plus />
      </IconButton>
      <IconButton onClick={toggle}>
        <Sun />
      </IconButton>
    </ControlsContainer>
  )
}

const ControlsContainer = styled.div({
  gridArea: "controls",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
})
