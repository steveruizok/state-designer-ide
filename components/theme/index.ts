import { styled, css, lightTheme, darkTheme } from "./core"

export { styled, css, lightTheme, darkTheme }

export const Box = styled.div({})

export const Grid = styled.div({
  display: "grid",
})

export const Flex = styled.div({
  display: "flex",
})

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
  "&:hover": {
    bg: "$shadowLight",
  },
  variants: {
    variant: {
      nodeEvent: {
        py: "$1",
        px: "$1",
        fontSize: "$1",
        fontWeight: "bold",
        fontFamily: "$body",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
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

export const Input = styled.input({})

export const Text = styled.p({
  m: 0,
  p: 0,
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
    color: "red",
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
