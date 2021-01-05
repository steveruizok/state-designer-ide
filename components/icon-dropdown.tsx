import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as React from "react"

import { IconButton } from "./theme"
import { styled } from "components/theme"

interface Props extends Partial<DropdownMenu.DropdownMenuContentOwnProps> {
  icon: React.ReactNode
  children: React.ReactNode
}

export default function IconDropdown({ icon, children, ...props }: Props) {
  return (
    <DropdownMenu.Root>
      <StyledTrigger>
        <IconButton>{icon}</IconButton>
      </StyledTrigger>
      <StyledContent {...props}>
        {children}
        <StyledArrow />
      </StyledContent>
    </DropdownMenu.Root>
  )
}

const StyledTrigger = styled(DropdownMenu.Trigger, {
  bg: "transparent",
  border: "none",
  outline: "none",
})

const StyledContent = styled(DropdownMenu.Content, {
  pointerEvents: "all",
  bg: "$toastBg",
  p: "$0",
  color: "$text",
  width: "fit-content",
  borderRadius: "$2",
  fontSize: "$1",
  fontWeight: "normal",
  boxShadow: "0 6px 24px $shadow",
  overflow: "hidden",
})

const StyledArrow = styled(DropdownMenu.Arrow, {
  fill: "$toastBg",
})

export const DropdownItem = styled(DropdownMenu.Item, {
  py: "$1",
  px: "$2",
  cursor: "pointer",
  outline: "none",
  "&:nth-of-type(1)": {
    borderRadius: "$1 $1 0 0",
  },
  "&:nth-last-of-type(1)": {
    borderRadius: "0 0 $1 $1",
  },
  "&:hover": {
    bg: "$shadow",
  },
})

export const DropdownSeparator = styled(DropdownMenu.Separator, {
  height: 1,
  borderBottom: "1px solid $muted",
  my: "$0",
})
