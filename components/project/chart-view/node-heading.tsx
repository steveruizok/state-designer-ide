import { S } from "@state-designer/react"
import { Disc, MoreVertical } from "react-feather"
// import IconSelect from "../icon-select"
import ProjectState from "../state"
import { styled, IconButton } from "components/theme"

const NodeHeading: React.FC<{
  node: S.State<any, any>
}> = ({ node }) => {
  return (
    <NodeHeadingContainer data-isactive={node.active} type={node.type}>
      {node.isInitial && (
        <Disc strokeWidth={3} size={12} style={{ marginRight: 2 }} />
      )}
      <h3>{node.name}</h3>
      <IconButton data-hidey="true">
        <MoreVertical />
      </IconButton>
      {/* <IconSelect
        data-hidey="true"
        icon={<MoreVertical />}
        title="State"
        options={{
          "Zoom to State": () => UI.send("ZOOMED_TO_NODE", { path: node.path }),
          "Force Transition": () =>
            ProjectState.data.captive.forceTransition(node.name),
          "Force Previous Transition": () =>
            ProjectState.data.captive.forceTransition(node.name + ".previous"),
          "Force Restore Transition": () =>
            ProjectState.data.captive.forceTransition(node.name + ".restore"),
        }}
      /> */}
    </NodeHeadingContainer>
  )
}

export default NodeHeading

const NodeHeadingContainer = styled.div({
  display: "flex",
  py: "$0",
  pl: "$1",
  justifyContent: "space-between",
  alignItems: "center",
  borderColor: "$active",
  h3: {
    fontSize: "$1",
    m: 0,
    p: 0,
    display: "inline-block",
    ml: "$0",
    flexGrow: 1,
  },
  "&[data-isactive='false']": {
    borderColor: "$inactive",
  },
  "& > *[data-hidey='true']": {
    visibility: "hidden",
  },
  "&:hover > *[data-hidey='true']": {
    visibility: "visible",
  },
  variants: {
    type: {
      leaf: {},
      branch: {},
      parallel: {
        borderBottom: "1px solid $outline",
      },
    },
  },
})
