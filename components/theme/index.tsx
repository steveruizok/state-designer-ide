import * as React from "react"
import * as _Checkbox from "@radix-ui/react-checkbox"

import { css, darkTheme, lightTheme, styled } from "./core"

import { Check } from "react-feather"

export { styled, css, lightTheme, darkTheme }

// These components are shared with the live view, though they might also
// be used in the app. TODO: Make these a clean separation.

export const Container = styled.div({
  display: "grid",
  p: "$3",
  gap: "$2",
  bg: "$root",
  borderRadius: "$2",
  boxShadow: "0px 0px 12px -2px $shadow",
})

export const Box = styled.div({})

export const Grid = styled.div({
  display: "grid",
  variants: {
    gaps: {
      none: {
        gap: 0,
      },
      tight: {
        gap: "$0",
      },
      thin: {
        gap: "$1",
      },
      normal: {
        gap: "$2",
      },
      cozy: {
        gap: "$3",
      },
    },
  },
})

export const Flex = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "$1",
  variants: {
    gaps: {
      none: {
        gap: 0,
      },
      tight: {
        gap: "$0",
      },
      thin: {
        gap: "$1",
      },
      normal: {
        gap: "$2",
      },
      cozy: {
        gap: "$3",
      },
    },
  },
})

export const Heading = styled.h2({
  variants: {
    highlight: {
      true: { color: "$accent" },
    },
    center: {
      true: { textAlign: "center" },
    },
    monospace: {
      true: { fontFamily: "$monospace" },
    },
  },
})

export const Text = styled.p({
  m: 0,
  p: 0,
  fontSize: "$2",
  fontWeight: "bold",
  lineHeight: "$body",
  color: "$text",
  variants: {
    highlight: {
      true: { color: "$accent" },
    },
    center: {
      true: { textAlign: "center" },
    },
    monospace: {
      true: { fontFamily: "$monospace" },
    },
    variant: {
      body: {
        fontSize: "$2",
        fontWeight: "normal",
        lineHeight: "$body",
      },
      ui: {
        fontSize: "$1",
        lineHeight: "$ui",
        m: 0,
        p: 0,
      },
      detail: {
        fontSize: "$1",
        lineHeight: "$ui",
        color: "$inactive",
        fontWeight: "normal",
      },
    },
  },
})

export const View = styled.div({
  position: "relative",
  height: "100%",
  width: "100%",
  display: "flex",
  overflow: "hidden",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
})

export const Input = styled.input({
  fontFamily: "$body",
  fontSize: "$2",
  color: "$text",
  bg: "$muted",
  px: "$2",
  py: "$1",
  border: "none",
  borderRadius: "$1",
  outline: "none",
  "&:focus:enabled": {
    bg: "$hover",
  },
  "&:disabled": {
    opacity: 0.5,
  },
})

const StyledCheckbox = styled(_Checkbox.Root, {
  appearance: "none",
  cursor: "pointer",
  backgroundColor: "transparent",
  border: "none",
  padding: 0,
  boxShadow: "inset 0 0 0 2px $text",
  width: 15,
  height: 15,
  borderRadius: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  outline: "none",
  color: "$text",
  "& svg": {
    mt: "2px",
    height: 11,
    width: 11,
  },
  "&:disabled": {
    opacity: 0.5,
  },
  "&:hover:enabled": {
    boxShadow: "inset 0 0 0 2px $accent",
  },
})

interface CheckboxProps extends Partial<_Checkbox.CheckboxOwnProps> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => (
    <StyledCheckbox
      defaultChecked
      {...props}
      onCheckedChange={props.onCheckedChange || props.onChange}
      ref={ref}
    >
      <_Checkbox.Indicator>
        <Check strokeWidth={4} />
      </_Checkbox.Indicator>
    </StyledCheckbox>
  ),
)

export const Label = styled.label({
  fontSize: "$1",
})

export const PlainButton = styled.button({
  cursor: "pointer",
  fontWeight: "bold",
  fontFamily: "$body",
  fontSize: "$2",
  lineHeight: "$ui",
  width: "100%",
  px: "$3",
  py: "$2",
  alignItems: "center",
  textAlign: "center",
  display: "grid",
  gridAutoFlow: "column",
  gap: "$0",
  outline: "none",
  bg: "$muted",
  border: "none",
  borderRadius: "$1",
  color: "$text",
  "&:hover:enabled": {
    bg: "$hover",
  },
  "&:disabled": {
    opacity: 0.5,
  },
  variants: {
    variant: {
      ghost: {
        bg: "$transparent",
        color: "$text",
      },
    },
    display: {
      tight: {
        display: "block",
        width: "100%",
        flexGrow: 2,
      },
    },
  },
})

export const PlainIconButton = styled.button({
  color: "$text",
  bg: "$muted",
  borderRadius: "$1",
  fontFamily: "$body",
  fontSize: "$2",
  fontWeight: "bold",
  border: "none",
  outline: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:disabled": {
    opacity: 0.5,
  },
  "& > p": {
    pr: "$1",
  },
  "&:hover:enabled": {
    bg: "$hover",
  },
  p: "$1",
  cursor: "pointer",
  svg: {
    height: 18,
    width: 18,
  },
})

export const Divider = styled.hr({
  borderColor: "$inactive",
  borderBottom: 0,
})

// App-specific (these are used in the app and not passed to LiveView)

export const Button = styled.button({
  color: "$text",
  fontSize: "$1",
  fontWeight: "bold",
  fontFamily: "$body",
  lineHeight: "$ui",
  px: "$2",
  py: "$2",
  borderRadius: "$1",
  bg: "transparent",
  border: "none",
  outline: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  "&:hover": {
    bg: "$shadowLight",
    color: "$accent",
    "&:disabled": {
      color: "$text",
    },
  },
  "&:disabled": {
    opacity: 0.5,
  },
  "&[data-disabled=true]": {
    opacity: 0.5,
  },
  variants: {
    highlight: {
      on: {
        color: "$accent",
      },
      off: {
        color: "$text",
      },
    },
    variant: {
      cta: {
        color: "$accent",
        ml: "$2",
        bg: "$muted",
        height: 40,
      },
      dialogWide: {
        borderTop: "1px solid $border",
        mx: "-$2",
        justifyContent: "center",
      },
      delete: {
        color: "$inactive",
        textAlign: "center",
        justifyContent: "center",
        position: "absolute",
        width: "100%",
        bottom: -96,
        fontWeight: "normal",
      },
      iconLeft: {
        px: "$1",
        py: 0,
        "& > svg": {
          mr: "$0",
        },
      },
      nodeEvent: {
        py: "$1",
        px: "$1",
        fontSize: "$1",
        fontWeight: "bold",
        fontFamily: "$body",
        width: "fit-content",
        borderRadius: "$0",
        color: "$text",
        cursor: "pointer",
        outline: "none",
        "&:disabled": {
          cursor: "not-allowed",
          color: "$inactive",
        },
        "& > *[data-hidey='true']": {
          visibility: "hidden",
        },
      },
    },
  },
})

export const TitleRow = styled.div({
  display: "flex",
  alignItems: "center",
  bg: "$muted",
  height: 40,
  color: "$text",
  borderBottom: "1px solid $shadow",
  userSelect: "none",
  "& p": {
    flexGrow: 1,
  },
  px: "$0",
  py: 0,
  "& > *[data-hidey='true']": {
    visibility: "hidden",
  },
  "&:hover > *[data-hidey='true']": {
    visibility: "visible",
  },
})

export const IconButton = styled.button({
  color: "$text",
  bg: "transparent",
  borderRadius: 4,
  fontFamily: "$body",
  fontSize: "$1",
  fontWeight: "bold",
  border: "none",
  outline: "none",
  display: "flex",
  alignItems: "center",
  "& > p": {
    pr: "$1",
    color: "currentColor",
  },
  "&:hover": {
    bg: "$shadowLight",
    color: "$accent",
  },
  p: "$1",
  cursor: "pointer",
  svg: {
    height: 18,
    width: 18,
  },
})

export const TabButton = styled.button({
  cursor: "pointer",
  color: "$text",
  fontFamily: "$body",
  fontSize: "$1",
  fontWeight: "$2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  background: "transparent",
  border: "none",
  outline: "none",
  "&:hover": {
    opacity: 1,
    color: "$text",
    bg: "$shadowLight",
  },
  variants: {
    variant: {
      code: {
        height: "100%",
        pl: "$2",
        flexGrow: 2,
        borderRadius: 4,
      },
      details: {
        py: "$1",
        px: "$2",
        borderRadius: 4,
      },
    },
    activeState: {
      active: {
        opacity: 1,
      },
      inactive: {
        opacity: 0.5,
      },
      warn: {
        color: "$accent",
      },
    },
    codeState: {
      clean: {
        "&::after": {
          content: "'•'",
          color: "transparent",
          marginLeft: "$0",
        },
      },
      dirty: {
        "&::after": {
          content: "'•'",
          color: "$text",
          marginLeft: "$0",
        },
      },
    },
  },
})

export const TabsContainer = styled.div({
  display: "flex",
  overflow: "hidden",
  justifyContent: "flex-start",
  flexGrow: 2,
})

export const Select = styled.select({
  cursor: "pointer",
  bg: "transparent",
  border: "none",
  color: "$text",
  px: "$0",
  outline: "none",
  fontSize: "$1",
  fontFamily: "$body",
  fontWeight: "bold",
  "&:hover": {
    color: "$accent",
  },
})
