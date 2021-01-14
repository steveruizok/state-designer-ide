import * as Types from "types"

import { Folder, MoreHorizontal } from "react-feather"
import IconDropdown, {
  DropdownItem,
  DropdownSeparator,
} from "components/icon-dropdown"

import dialogState from "states/dialog"
import { styled } from "components/theme"

interface ProjectGroupProps {
  group: Types.ProjectGroup
  children: React.ReactNode
}

export default function ProjectGroup({ group, children }: ProjectGroupProps) {
  return (
    <GroupOuterContainer>
      <TitleContainer>
        <Folder size={18} />
        <h4>{group.name}</h4>
        <IconDropdown icon={<MoreHorizontal />}>
          <DropdownItem
            onSelect={() =>
              dialogState.send("OPENED_RENAME_PROJECT_GROUP_DIALOG", { group })
            }
          >
            Rename
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem
            onSelect={() =>
              dialogState.send("OPENED_DELETE_PROJECT_GROUP_DIALOG", { group })
            }
          >
            Delete
          </DropdownItem>
        </IconDropdown>
      </TitleContainer>
      <GroupContainer>{children}</GroupContainer>
    </GroupOuterContainer>
  )
}

const GroupOuterContainer = styled.section({
  pb: "$7",
})

const TitleContainer = styled.div({
  borderBottom: "1px solid $shadowLight",
  color: "$text",
  pb: "$2",
  mr: "-$1",
  display: "flex",
  alignItems: "center",
  "& h4": {
    ml: "$1",
    flexGrow: 2,
  },
})

const GroupContainer = styled.div({})
