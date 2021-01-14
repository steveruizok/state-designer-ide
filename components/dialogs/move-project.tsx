import * as Dialog from "@radix-ui/react-dialog"
import * as React from "react"

import { Button, Input, Label, styled } from "components/theme"
import {
  DialogButtonsRow,
  StyledButton,
  StyledClose,
  StyledContent,
} from "./styled"

import dialogState from "states/dialog"
import { getUserGroups } from "lib/database"
import { useStateDesigner } from "@state-designer/react"

interface MoveProjectDialogProps {}

export default function MoveProjectDialog({}: MoveProjectDialogProps) {
  const [groups, setGroups] = React.useState([])
  const local = useStateDesigner(dialogState)

  React.useEffect(() => {
    getUserGroups().then((d) => setGroups(d))
  }, [])

  return (
    <StyledContent>
      <ButtonList>
        <ul>
          {groups ? (
            Object.values(groups)
              .filter((group) => group.id !== local.data.project.groupId)
              .map((group) => (
                <li key={group.id}>
                  <StyledButton
                    onClick={() =>
                      dialogState.send("SELECTED_GROUP", {
                        groupId: group.id,
                      })
                    }
                  >
                    {group.name}
                  </StyledButton>
                </li>
              ))
          ) : (
            <li>Loading groups...</li>
          )}
        </ul>
      </ButtonList>
      <DialogButtonsRow>
        <StyledClose>Cancel</StyledClose>
      </DialogButtonsRow>
    </StyledContent>
  )
}

const ButtonList = styled.div({
  ul: {
    listStyleType: "none",
    mb: "$2",
    p: 0,
  },
  li: {
    m: 0,
    p: 0,
  },
  button: {
    width: "100%",
  },
})
