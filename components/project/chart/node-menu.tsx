import { MoreHorizontal } from "react-feather"
import IconDropdown, { DropdownItem } from "components/icon-dropdown"
import projectState from "states/project"
import { S } from "@state-designer/react"

interface NodeMenuProps {
  node: S.State<any, any>
}

export default function NodeMenu({ node }: NodeMenuProps) {
  return (
    <IconDropdown icon={<MoreHorizontal size={16} />}>
      <DropdownItem
        onSelect={(e) => {
          e.preventDefault()
          projectState.data.captive?.forceTransition(node.path)
        }}
      >
        Force Transition
      </DropdownItem>
    </IconDropdown>
  )
}
