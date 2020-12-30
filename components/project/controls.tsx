import { Copy, Minus, Plus, Sun } from "react-feather"
import { IconButton, Text, styled } from "components/theme"

import codePanelState from "states/code-panel"
import { duplicateProjectAndPush } from "lib/database"
import useTheme from "hooks/useTheme"

interface ControlsProps {
  oid: string
  pid: string
  uid?: string
  isAuthenticated?: boolean
}

export default function Controls({ oid, pid, uid }: ControlsProps) {
  const { toggle } = useTheme()
  return (
    <ControlsContainer>
      {uid && (
        <IconButton onClick={() => duplicateProjectAndPush(pid, oid)}>
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
