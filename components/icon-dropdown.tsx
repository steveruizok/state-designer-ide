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
  mx: "12px",
})

const itemStyles = {
  userSelect: "none" as any,
  py: "$1",
  px: "$2",
  cursor: "pointer",
  outline: "none",
  br: "$1",
  transition: "background-color .1s",
  // "&:nth-of-type(1)": {
  //   borderRadius: "$1 $1 0 0",
  // },
  // "&:nth-last-of-type(1)": {
  //   borderRadius: "0 0 $1 $1",
  // },
  "&:hover": {
    bg: "$shadow",
  },
  "&[data-disabled]": {
    opacity: 0.5,
  },
}

export const DropdownItem = styled(DropdownMenu.Item, {
  ...itemStyles,
  svg: { ml: "$1", mr: 0 },
})

export const DropdownCheckboxItem = styled(DropdownMenu.CheckboxItem, {
  ...itemStyles,
  display: "grid",
  gap: "$1",
  gridTemplateColumns: "1fr minmax(auto, 16px)",
  gridAutoFlow: "column",
  svg: { ml: "$1", mr: 0 },
})

export const DropdownLabel = styled(DropdownMenu.DropdownMenuLabel, {
  px: "$2",
  py: "$1",
  opacity: 0.5,
  userSelect: "none",
  fontSize: "$0",
  textTransform: "uppercase",
  letterSpacing: 1,
  fontWeight: "bold",
})

export const DropdownItemIndicator = styled(
  DropdownMenu.DropdownMenuItemIndicator,
  { display: "block" },
)

export const DropdownSeparator = styled(DropdownMenu.Separator, {
  height: 1,
  borderBottom: "1px solid $muted",
  my: "$0",
})
