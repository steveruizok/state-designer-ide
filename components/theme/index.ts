import { css, darkTheme, lightTheme, styled } from "./core"

export { styled, css, lightTheme, darkTheme }

// These components are shared with the live view, though they might also
// be used in the app. TODO: Make these a clean separation.

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

export const Heading1 = styled.h1({ color: "$text", m: 0, p: 0 })
export const Heading2 = styled.h2({ color: "$text", m: 0, p: 0 })
export const Heading3 = styled.h3({ color: "$text", m: 0, p: 0 })
export const Heading4 = styled.h4({ color: "$text", m: 0, p: 0 })
export const Heading5 = styled.h5({ color: "$text", m: 0, p: 0 })
export const Heading6 = styled.h6({ color: "$text", m: 0, p: 0 })

export const Text = styled.p({
  m: 0,
  p: 0,
  color: "$text",
  variants: {
    variant: {
      body: {
        fontSize: "$2",
        lineHeight: "$body",
      },
      ui: {
        fontSize: "$1",
        lineHeight: "$ui",
      },
    },
  },
})

export const Input = styled.input({
  fontFamily: "$body",
  fontSize: "$1",
  color: "$text",
  bg: "$muted",
  px: "$1",
  py: "$0",
})

export const Label = styled.label({
  fontSize: "$1",
})

export const PlainButton = styled.button({
  color: "$text",
  fontSize: "$1",
  fontWeight: "bold",
  fontFamily: "$body",
  lineHeight: "$ui",
  textAlign: "center",
  px: "$2",
  py: "$1",
  borderRadius: "$1",
  bg: "$muted",
  border: "none",
  outline: "none",
  cursor: "pointer",
  display: "grid",
  gridAutoFlow: "column",
  gap: "$0",
  alignItems: "center",
  "&:hover": {
    color: "$accent",
    bg: "$hover",
  },
  "&:disabled": {
    opacity: 0.5,
  },
  variants: {
    display: {
      wide: {
        display: "block",
        width: "100%",
        flexGrow: 2,
      },
    },
  },
})

export const PlainIconButton = styled.button({
  color: "$text",
  bg: "transparent",
  borderRadius: "$1",
  fontFamily: "$body",
  fontSize: "$0",
  fontWeight: "bold",
  border: "none",
  outline: "none",
  display: "flex",
  alignItems: "center",
  "&:disabled": {
    opacity: 0.5,
  },
  "& > p": {
    pr: "$1",
  },
  "&:hover": {
    color: "$accent",
    bg: "$hover",
  },
  p: "$1",
  cursor: "pointer",
  svg: {
    height: 18,
    width: 18,
  },
})

// App-specific (these are used in the app and not passed to LiveView)

export const Button = styled.button({
  color: "$text",
  fontSize: "$1",
  fontWeight: "bold",
  fontFamily: "$body",
  lineHeight: "$ui",
  px: "$1",
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
  variants: {
    variant: {
      iconLeft: {
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
        borderRadius: 2,
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
  fontSize: "$0",
  fontWeight: "bold",
  border: "none",
  outline: "none",
  display: "flex",
  alignItems: "center",
  "& > p": {
    pr: "$1",
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
