import Loading from "components/loading"
import * as React from "react"

import { DialogButtonsRow, StyledClose, StyledContent } from "./styled"

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
