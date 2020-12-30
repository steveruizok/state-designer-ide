import * as Dialog from "@radix-ui/react-dialog"

import { Button, Input, Label, styled } from "components/theme"

export const StyledContent = styled(Dialog.Content, {
  position: "fixed",
  bg: "$background",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 200,
  maxWidth: "fit-content",
  maxHeight: "85vh",
  p: "$2",
  pb: 0,
  mt: "-5vh",
  borderRadius: "$2",
  border: "1px solid $shadow",
  boxShadow: "0 6px 24px $shadow",
  "&:focus": {
    outline: "none",
  },
  display: "grid",
})

export const StyledClose = styled(Dialog.Close, {
  cursor: "pointer",
  bg: "transparent",
  outline: "none",
  border: "none",
  fontFamily: "$body",
  fontSize: "$1",
  fontWeight: "bold",
  color: "$text",
  py: "$2",
  px: "$1",
  flexGrow: 2,
  borderRadius: "$1",
  "&:hover": {
    bg: "$shadowLight",
  },
})

export const DialogButtonsRow = styled.div({
  display: "flex",
  mx: "-$2",
  borderTop: "1px solid $border",
  "& > button:nth-of-type(1)": {
    borderRight: "1px solid $border",
  },
})

export const InputWrapper = styled.div({
  display: "grid",
  gap: "$2",
  pb: "$2",
})
