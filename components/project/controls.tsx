import {
  Codesandbox,
  Copy,
  Minus,
  Plus,
  Sun,
  Check,
  Share as ShareIcon,
  Settings as SettingsIcon,
} from "react-feather"
import { IconButton, Text, styled } from "components/theme"
import { useStateDesigner } from "@state-designer/react"
import IconDropdown, {
  DropdownCheckboxItem,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownItemIndicator,
} from "components/icon-dropdown"

import codePanelState from "states/code-panel"
import dialogState from "states/dialog"
import { resetOffsets } from "lib/local-data"
import { getCodeSandboxUrl } from "lib/database"
import toastState from "states/toast"
import useProject from "hooks/useProject"
import useTheme from "hooks/useTheme"
import uiState from "states/ui"
import useUser from "hooks/useUser"
import { useRouter } from "next/router"

interface ControlsProps {
  oid: string
  pid: string
  uid?: string
  isAuthenticated?: boolean
}

export default function Controls({ oid, pid, uid }: ControlsProps) {
  const { project } = useProject(pid, oid)

  async function openCodeSandbox() {
    const link = await getCodeSandboxUrl(oid, pid).catch((e) => {})

    if (!link) {
      toastState.send("ADDED_TOAST", {
        message: "Sorry, we couldn't reach CodeSandbox.",
      })
      return
    }

    navigator.clipboard.writeText(link.url)

    toastState.send("ADDED_TOAST", {
      message: "Copied CodeSandbox URL to Clipboard",
    })
  }

  async function copyShareLink(page: string) {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/u/${oid}/p/${pid}/${page}`,
    )
    toastState.send("ADDED_TOAST", {
      message: "Copied Share Link to Clipboard.",
    })
  }

  return (
    <ControlsContainer>
      {uid && !(oid === uid) && (
        <IconButton
          title="Copy Project"
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
      <IconDropdown icon={<ShareIcon size={16} />}>
        <DropdownLabel>Export and Share</DropdownLabel>
        <DropdownItem
          title="Copy CodeSandbox Link"
          onSelect={(e) => {
            e.preventDefault()
            openCodeSandbox()
          }}
        >
          Copy CodeSandbox Link
        </DropdownItem>
        <DropdownItem
          title="Copy Share Link"
          onSelect={(e) => {
            e.preventDefault()
            copyShareLink("view")
          }}
        >
          Copy Share Link
        </DropdownItem>
        <DropdownItem
          title="Duplicate Project"
          onSelect={(e) => {
            e.preventDefault()
            dialogState.send("OPENED_PROJECT_DUPLICATE_DIALOG", {
              project,
            })
          }}
        >
          Duplicate Project
        </DropdownItem>
      </IconDropdown>
      <Settings />
    </ControlsContainer>
  )
}

const ControlsContainer = styled.div({
  gridArea: "controls",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
})

function Settings() {
  const router = useRouter()
  const user = useUser()
  const {
    data: { minimap, fontSize, wordWrap },
  } = useStateDesigner(codePanelState)

  const {
    data: {
      content: { visible },
    },
  } = useStateDesigner(uiState)

  const { toggle, theme } = useTheme()

  return (
    <IconDropdown icon={<SettingsIcon size={16} />}>
      <DropdownLabel>App</DropdownLabel>
      <DropdownCheckboxItem
        checked={theme === "dark"}
        onSelect={(e) => {
          e.preventDefault()
          toggle()
        }}
      >
        Dark Mode
        <DropdownItemIndicator>
          <Check size={12} strokeWidth={4} />
        </DropdownItemIndicator>
      </DropdownCheckboxItem>
      <DropdownCheckboxItem
        checked={visible}
        onSelect={(e) => {
          e.preventDefault()
          uiState.send("TOGGLED_CONTENT_PANEL")
        }}
      >
        Content Panel
        <DropdownItemIndicator>
          <Check size={12} strokeWidth={4} />
        </DropdownItemIndicator>
      </DropdownCheckboxItem>
      <DropdownItem
        onSelect={(e) => {
          e.preventDefault()
          resetOffsets()
        }}
      >
        Reset Panels
      </DropdownItem>
      <DropdownSeparator />
      <DropdownLabel>Code Editor</DropdownLabel>
      <DropdownCheckboxItem
        checked={minimap}
        onSelect={(e) => {
          e.preventDefault()
          codePanelState.send("TOGGLED_MINIMAP")
        }}
      >
        Show Minimap
        <DropdownItemIndicator>
          <Check size={12} strokeWidth={4} />
        </DropdownItemIndicator>
      </DropdownCheckboxItem>
      <DropdownCheckboxItem
        checked={wordWrap}
        onSelect={(e) => {
          e.preventDefault()
          codePanelState.send("TOGGLED_WORD_WRAP")
        }}
      >
        Wrap code
        <DropdownItemIndicator>
          <Check size={12} strokeWidth={4} />
        </DropdownItemIndicator>
      </DropdownCheckboxItem>
      <DropdownItem
        onSelect={(e) => {
          e.preventDefault()
          codePanelState.send("DECREASED_FONT_SIZE")
        }}
      >
        Font Size <Minus size={10} strokeWidth={4} />
      </DropdownItem>
      <DropdownItem
        onSelect={(e) => {
          e.preventDefault()
          codePanelState.send("INCREASED_FONT_SIZE")
        }}
      >
        Font Size <Plus size={10} strokeWidth={4} />
      </DropdownItem>
      <DropdownItem
        disabled={fontSize === 13}
        onSelect={(e) => {
          e.preventDefault()
          codePanelState.send("RESET_FONT_SIZE")
        }}
      >
        Reset Font Size
      </DropdownItem>
      <DropdownSeparator />
      <DropdownLabel>Account</DropdownLabel>
      {user.id ? (
        <DropdownItem
          onSelect={(e) => {
            e.preventDefault()
            user.signOut()
          }}
        >
          Sign Out
        </DropdownItem>
      ) : (
        <DropdownItem
          onSelect={(e) => {
            router.push("/auth")
          }}
        >
          Sign In
        </DropdownItem>
      )}
    </IconDropdown>
  )
}
