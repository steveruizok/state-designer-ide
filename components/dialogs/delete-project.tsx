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

interface DeleteProjectDialogProps {}

export default function DeleteProjectDialog({}: DeleteProjectDialogProps) {
  return (
    <StyledContent>
      <InputWrapper>Are you sure you want to delete this project?</InputWrapper>
      <DialogButtonsRow>
        <StyledClose>Cancel</StyledClose>
        <StyledClose onClick={() => dialogState.send("CONFIRMED")}>
          Delete
        </StyledClose>
      </DialogButtonsRow>
    </StyledContent>
  )
}
