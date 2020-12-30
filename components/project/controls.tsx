import { Copy, Minus, Plus, Sun } from "react-feather"
import { IconButton, Text, styled } from "components/theme"

import codePanelState from "states/code-panel"
import dialogState from "states/dialog"
import useProject from "hooks/useProject"
import useTheme from "hooks/useTheme"

interface ControlsProps {
  oid: string
  pid: string
  uid?: string
  isAuthenticated?: boolean
}

export default function Controls({ oid, pid, uid }: ControlsProps) {
  const { toggle } = useTheme()
  const project = useProject(pid, oid)

  return (
    <ControlsContainer>
      {uid && (
        <IconButton
          onClick={() =>
            dialogState.send("OPENED_PROJECT_DUPLICATE_DIALOG", {
              project,
            })
          }
        >
          {!(oid === uid) && <Text variant="ui">Copy Project</Text>}
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
