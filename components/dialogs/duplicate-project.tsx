import * as Dialog from "@radix-ui/react-dialog"
import * as React from "react"

import { Button, Input, Label, styled } from "components/theme"
import {
  DialogButtonsRow,
  InputWrapper,
  StyledClose,
  StyledContent,
} from "./styled"

import dialogState from "states/dialog"
import useProject from "hooks/useProject"
import { useStateDesigner } from "@state-designer/react"

interface RenameProjectDialogProps {}

export default function RenameProjectDialog({}: RenameProjectDialogProps) {
  const local = useStateDesigner(dialogState)

  const { currentName } = local.data.project

  return (
    <StyledContent onOpenAutoFocus={(e) => e.preventDefault()}>
      <InputWrapper>
        <Label htmlFor="projectName">Duplicate Project</Label>
        <Input
          name="projectName"
          value={currentName}
          onChange={(e) =>
            dialogState.send("CHANGED_PROJECT_NAME", {
              name: e.currentTarget.value,
            })
          }
          onKeyPress={(e) => e.key === "Enter" && dialogState.send("CONFIRMED")}
        />
      </InputWrapper>
      <DialogButtonsRow>
        <StyledClose>Cancel</StyledClose>
        <StyledClose
          onClick={() => dialogState.send("CONFIRMED")}
          disabled={currentName.length === 0}
        >
          Duplicate
        </StyledClose>
      </DialogButtonsRow>
    </StyledContent>
  )
}