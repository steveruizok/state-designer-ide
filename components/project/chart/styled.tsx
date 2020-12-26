import { styled } from "components/theme"

export const NodeContainer = styled.div({
  color: "$text",
  fontFamily: "$monospace",
  fontSize: "$1",
  bg: "$node",
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
      root: {},
    },
    nodeLevel: {
      child: {
        bg: "$node",
      },
      root: {
        bg: "$root",
        border: "1px solid $active",
        borderRadius: 12,
      },
    },
    nodeState: {
      active: {
        borderColor: "$active",
      },
      inactive: {
        borderColor: "$inactive",
      },
    },
    state: {
      root: {},
      "root-highlight": {
        border: "$accent",
      },
      normal: {},
      highlight: {
        // color: "$accent",
        border: "$accent",
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
  borderLeft: "1px solid dashed",
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

export const Divider = styled.hr({
  border: 0,
  borderBottom: "1px solid currentColor",
  mt: "$0",
  mb: 0,
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
