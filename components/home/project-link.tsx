import * as Types from "types"

import IconDropdown, {
  DropdownItem,
  DropdownSeparator,
} from "components/icon-dropdown"
import { Text, styled } from "components/theme"

import Link from "next/link"
import { MoreHorizontal } from "react-feather"
import dialogState from "states/dialog"

interface ProjectLinkProps {
  project: Types.ProjectData
  user: Types.User
  groupId: string
}

export default function ProjectLink({
  user,
  project,
  groupId,
}: ProjectLinkProps) {
  const { id, name, dateCreated, lastModified } = project

  return (
    <li key={id}>
      <ProjectLinkWrapper>
        <Link href={`/u/${user.uid}/p/${id}`}>
          <a>
            <h4>{name}</h4>
            <Text variant="ui">
              Last modified {new Date(lastModified).toLocaleDateString()} -
              Created {new Date(dateCreated).toLocaleDateString()}
            </Text>
          </a>
        </Link>
        <IconDropdown icon={<MoreHorizontal />}>
          <DropdownItem
            onSelect={() =>
              dialogState.send("OPENED_PROJECT_RENAME_DIALOG", {
                project,
                groupId,
              })
            }
          >
            Rename
          </DropdownItem>
          <DropdownItem
            onSelect={() =>
              dialogState.send("OPENED_PROJECT_DUPLICATE_DIALOG", {
                project,
                groupId,
              })
            }
          >
            Duplicate
          </DropdownItem>
          <DropdownItem
            onSelect={() =>
              dialogState.send("OPENED_MOVE_PROJECT_DIALOG", {
                project,
                groupId,
              })
            }
          >
            Move to Group
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem
            onSelect={() =>
              dialogState.send("OPENED_PROJECT_DELETE_DIALOG", {
                project,
                groupId,
              })
            }
          >
            Delete
          </DropdownItem>
        </IconDropdown>
      </ProjectLinkWrapper>
    </li>
  )
}

const ProjectLinkWrapper = styled.div({
  display: "flex",
  alignItems: "center",
  borderRadius: "$2",
  pl: "$3",
  pr: "$2",
  mx: "-$3",
  "& > p": {
    py: "$2",
  },
  "& > a": {
    py: "$2",
    color: "$text",
    textDecoration: "none",
    flexGrow: 2,
    [`${Text}`]: {
      mt: "$1",
      opacity: 0.3,
      fontWeight: "normal",
    },
    "&:hover": {
      color: "$accent",
      h4: { color: "$accent" },
      [`${Text}:nth-of-type(1)`]: {
        opacity: 0.8,
      },
    },
  },
  "&:hover": {
    bg: "$shadowLight",
  },
  "& select": {
    py: "$1",
    opacity: 0.3,
  },
  "&:hover select": {
    opacity: 1,
  },
})
