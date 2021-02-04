import { styled } from "components/theme"
import { Disc, MoreHorizontal } from "react-feather"
import IconDropdown, { DropdownItem } from "components/icon-dropdown"
import projectState from "states/project"
import { S } from "@state-designer/react"

const NodeHeading: React.FC<{
  node: S.State<any, any>
}> = ({ node }) => {
  return (
    <NodeHeadingContainer data-isactive={node.active} type={node.type}>
      {node.isInitial && (
        <Disc strokeWidth={3} size={12} style={{ marginRight: 2 }} />
      )}
      <h3>{node.name}</h3>
      <IconDropdown icon={<MoreHorizontal size={16} />}>
        <DropdownItem
          disabled={node.active}
          onSelect={() => projectState.data.captive?.forceTransition(node.name)}
        >
          Force Transition
        </DropdownItem>
      </IconDropdown>
    </NodeHeadingContainer>
  )
}

export default NodeHeading

const NodeHeadingContainer = styled.div({
  display: "flex",
  py: "$0",
  pl: "$1",
  pr: "$0",
  justifyContent: "space-between",
  alignItems: "center",
  borderColor: "$active",
  h3: {
    fontSize: "$2",
    m: 0,
    p: 0,
    display: "inline-block",
    mx: "$0",
    flexGrow: 1,
  },
  "&[data-isactive='false']": {
    borderColor: "$inactive",
  },
  "& > *[data-hidey='true']": {
    visibility: "hidden",
  },
  variants: {
    type: {
      leaf: {},
      branch: {},
      parallel: {},
    },
  },
})
