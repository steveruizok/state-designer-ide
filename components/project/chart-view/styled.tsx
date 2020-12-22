import { styled } from "components/theme"

export const NodeContainer = styled.div({
  color: "$text",
  fontFamily: "$monospace",
  fontSize: "$1",
  "&[data-isactive='false']": {
    borderColor: "$inactive",
  },
  "&[data-isroot='true']": {
    bg: "$root",
  },
  variants: {
    childOf: {
      leaf: {},
      branch: {
        m: "$1",
        bg: "$node",
        border: "2px solid $active",
        borderRadius: 12,
        overflow: "hidden",
        height: "fit-content",
        minWidth: 96,
      },
      parallel: {
        width: "fit-content",
      },
    },
  },
})

export const ChildNodesContainer = styled.div({
  p: "$0",
  variants: {
    type: {
      leaf: {},
      branch: {
        display: "flex",
        flexWrap: "wrap",
      },
      parallel: {
        display: "grid",
        width: "fit-content",
        gridAutoColumns: "fit-content",
        gap: 0,
        gridAutoFlow: "column",
        overflow: "hidden",
        position: "relative",
      },
    },
  },
})

export const ParallelDivider = styled.div({
  alignSelf: "stretch",
  height: "100%",
  borderLeft: "2px solid dashed",
  variants: {
    state: {
      active: {
        borderColor: "$text",
      },
      inactive: {
        borderColor: "$inactive",
      },
    },
  },
})
