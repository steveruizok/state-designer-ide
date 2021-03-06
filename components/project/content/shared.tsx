import { S } from "@state-designer/react"
import { styled } from "components/theme"

export const Button = styled.button({
  color: "$text",
  fontSize: "$1",
  fontWeight: "bold",
  fontFamily: "$body",
  lineHeight: "$ui",
  bg: "transparent",
  px: "$1",
  height: 36,
  m: 0,
  flexGrow: 2,
  border: "none",
  outline: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  svg: {
    mr: "$0",
  },
  "&[data-active=false]": {
    opacity: 0.5,
  },
  "&[data-highlight=true]": {
    bg: "$codeHl",
  },
  variants: {
    display: {
      wide: {
        width: "100%",
        justifyContent: "center",
        "&:active": {
          bg: "$muted",
        },
        "&:hover": {
          color: "$accent",
        },
        "&:disabled": {
          opacity: 0.5,
        },
      },
    },
    zapped: {
      on: {
        transition: "none",
        color: "$accent",
      },
      off: {
        transition: "color .5s ease-out .1s",
        color: "$text",
      },
    },
  },
})

export const ContentItem = styled.li({
  display: "flex",
  p: 0,
  m: 0,
  "&:hover": {
    bg: "$codeHl",
  },
})

export const Spacer = styled.div({
  flexGrow: 2,
})

export const ContentTitle = styled.div({
  display: "flex",
  fontSize: "$1",
  alignItems: "center",
  bg: "$muted",
  p: "$1",
  height: 40,
  color: "$text",
  borderBottom: "1px solid $shadow",
  whiteSpace: "nowrap",
})

export const ContentSection = styled.ul({
  m: 0,
  pl: 0,
  overflowY: "scroll",
  height: "100%",
  whiteSpace: "nowrap",
  "&::-webkit-overflow-scrolling": "auto",
})

export const ContentWrapper = styled.div({
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  borderBottom: "2px solid $border",
})
