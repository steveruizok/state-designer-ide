import { Codesandbox, Copy, Minus, Plus, Sun } from "react-feather"
import { IconButton, Text, styled } from "components/theme"

import codePanelState from "states/code-panel"
import dialogState from "states/dialog"
import { getCodeSandboxUrl } from "lib/database"
import toastState from "states/toast"
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

  async function openCodeSandbox() {
    const link = await getCodeSandboxUrl(oid, pid).catch((e) => {})

    if (!link) {
      toastState.send("ADDED_TOAST", {
        message: "Sorry, we couldn't reach CodeSandbox.",
      })
      return
    }

    const elm = document.createElement("textarea")
    document.body.appendChild(elm)
    elm.value = link.url
    elm.select()
    document.execCommand("copy")
    document.body.removeChild(elm)
    toastState.send("ADDED_TOAST", {
      message: "Copied CodeSandbox URL to Clipboard",
    })
  }

  return (
    <ControlsContainer>
      <IconButton title="Open in Codesandbox" onClick={openCodeSandbox}>
        <Codesandbox />
      </IconButton>
      {uid && (
        <IconButton
          title="Duplicate Project"
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
      <IconButton
        title="Decrease Editor Font Size"
        onClick={() => codePanelState.send("DECREASED_FONT_SIZE")}
      >
        <Minus />
      </IconButton>
      <IconButton
        title="Increase Editor Font Size"
        onClick={() => codePanelState.send("INCREASED_FONT_SIZE")}
      >
        <Plus />
      </IconButton>
      <IconButton title="Toggle Dark Mode" onClick={toggle}>
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
