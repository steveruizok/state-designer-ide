import * as Dialog from "@radix-ui/react-dialog"
import { useStateDesigner } from "@state-designer/react"
import Loading from "components/loading"
import { Button, Input, Label, styled } from "components/theme"
import useProject from "hooks/useProject"
import * as React from "react"
import dialogState from "states/dialog"

import {
  DialogButtonsRow,
  InputWrapper,
  StyledClose,
  StyledContent,
} from "./styled"

interface CreateProjectDialogProps {}

export default function LoadingDialog({}: CreateProjectDialogProps) {
  return (
    <StyledContent>
      <Loading />
      <DialogButtonsRow>
        <StyledClose>Cancel</StyledClose>
      </DialogButtonsRow>
    </StyledContent>
  )
}
