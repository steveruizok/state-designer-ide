import * as React from "react"
import * as Types from "types"
import db from "utils/firestore"
import { AuthAction, withAuthUser, withAuthUserSSR } from "next-firebase-auth"

import {
  Button,
  IconButton,
  Input,
  Select,
  Text,
  styled,
} from "components/theme"
import { Home, MoreHorizontal, Sun, X } from "react-feather"
import IconDropdown, {
  DropdownItem,
  DropdownSeparator,
} from "components/icon-dropdown"
import Head from "next/head"
import Link from "next/link"
import dialogState from "states/dialog"
import useTheme from "hooks/useTheme"
import Loading from "components/loading"
import useAuthUser from "hooks/useAuthUser"
import useUserProjects from "hooks/useUserProjects"

let INITIAL_SORT = "Date"
let INITIAL_SORT_DIRECTION = "Descending"

type UserPageProps = {}

function UserPage({}: UserPageProps) {
  const user = useAuthUser()
  const { toggle } = useTheme()
  const { status, projects } = useUserProjects(user.id)

  const [sortBy, setSortBy] = React.useState(INITIAL_SORT)
  const [sortDirection, setSortDirection] = React.useState(
    INITIAL_SORT_DIRECTION,
  )
  const [filter, setFilter] = React.useState(null)

  let sortedProjects = projects.map((p) => ({
    ...p,
    lcName: p.name.toLowerCase(),
    lastModified: Date.parse(p.lastModified),
    dateCreated: Date.parse(p.dateCreated),
  }))

  if (filter) {
    sortedProjects = sortedProjects.filter((p) =>
      p.lcName.startsWith(filter.toLowerCase()),
    )
  }

  if (sortBy === "Name") {
    if (sortDirection === "Descending") {
      sortedProjects = sortedProjects.sort((a, b) =>
        b.lcName < a.lcName ? -1 : 1,
      )
    } else if (sortDirection === "Ascending") {
      sortedProjects = sortedProjects.sort((a, b) =>
        a.lcName < b.lcName ? -1 : 1,
      )
    }
  } else if (sortBy === "Date") {
    if (sortDirection === "Descending") {
      sortedProjects = sortedProjects.sort(
        (a, b) => b.lastModified - a.lastModified,
      )
    } else if (sortDirection === "Ascending") {
      sortedProjects = sortedProjects.sort(
        (a, b) => a.lastModified - b.lastModified,
      )
    }
  }

  return (
    <Layout>
      <Head>
        <title>{user.name} - State Designer</title>
      </Head>
      <MenuContainer>
        <Link href={user ? `/u/${user.id}` : "/"}>
          <IconButton>
            <Home />
          </IconButton>
        </Link>
        {user ? (
          <Button onClick={() => user.signOut()}>Log Out</Button>
        ) : (
          <Link href="api/login">
            <Button>Log in</Button>
          </Link>
        )}
      </MenuContainer>
      <Title>{user.name}</Title>
      <ControlsContainer>
        <IconButton onClick={toggle}>
          <Sun />
        </IconButton>
      </ControlsContainer>
      <MainContainer>
        <ListControls>
          <ListControlsGroup>
            Sort by
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option>Date</option>
              <option>Name</option>
            </Select>
            <Select
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
            >
              <option value="Ascending">Ascending</option>
              <option value="Descending">Descending</option>
            </Select>
          </ListControlsGroup>
          <ListControlsGroup>
            <Input
              value={filter || ""}
              onChange={(e) => setFilter(e.currentTarget.value)}
              placeholder="Filter"
            />
            <Button
              variant="cta"
              onClick={() => dialogState.send("OPENED_CREATE_PROJECT_DIALOG")}
            >
              Create New
            </Button>
          </ListControlsGroup>
        </ListControls>
        <ul>
          {status === "loading" ? (
            <Loading />
          ) : sortedProjects.length > 0 ? (
            sortedProjects.map(({ id, name, dateCreated, lastModified }, i) => (
              <li key={id}>
                <ProjectLink>
                  <Link href={`/u/${user.id}/p/${id}`}>
                    <a>
                      <h4>{name}</h4>
                      <Text variant="ui">
                        Last modified{" "}
                        {new Date(lastModified).toLocaleDateString()} - Created{" "}
                        {new Date(dateCreated).toLocaleDateString()}
                      </Text>
                    </a>
                  </Link>
                  <IconDropdown icon={<MoreHorizontal />}>
                    <DropdownItem
                      onSelect={() =>
                        dialogState.send("OPENED_PROJECT_RENAME_DIALOG", {
                          project: projects.find((p) => p.id === id),
                        })
                      }
                    >
                      Rename
                    </DropdownItem>
                    <DropdownItem
                      onSelect={() => {
                        console.log(
                          "finding project",
                          projects.find((p) => p.id === id),
                        )
                        dialogState.send("OPENED_PROJECT_DUPLICATE_DIALOG", {
                          project: projects.find((p) => p.id === id),
                        })
                      }}
                    >
                      Duplicate
                    </DropdownItem>
                    <DropdownSeparator />
                    <DropdownItem
                      onSelect={() =>
                        dialogState.send("OPENED_PROJECT_DELETE_DIALOG", {
                          project: projects.find((p) => p.id === id),
                        })
                      }
                    >
                      Delete
                    </DropdownItem>
                  </IconDropdown>
                </ProjectLink>
              </li>
            ))
          ) : (
            <ProjectLink>
              <Text>No projects found.</Text>
            </ProjectLink>
          )}
        </ul>
      </MainContainer>
    </Layout>
  )
}

export const getServerSideProps = withAuthUserSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})()

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADING,
  whenAuthed: AuthAction.RENDER,
  LoaderComponent: Loading,
})(UserPage)

const Layout = styled.div({
  display: "grid",
  gridTemplateRows: "42px 1fr",
  gridTemplateColumns: "1fr 1fr 1fr",
  gridTemplateAreas: `
		"menu title controls"
		"main main main"
	`,
  height: "100vh",
  maxHeight: "100vh",
})

const MenuContainer = styled.div({
  gridArea: "menu",
  display: "flex",
  alignItems: "center",
  borderBottom: "2px solid $shadow",
})

const Title = styled.div({
  gridArea: "title",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderBottom: "2px solid $shadow",
})

const MainContainer = styled.div({
  gridArea: "main",
  px: "$2",
  mx: "auto",
  width: "100%",
  maxWidth: 920,
  "& ul": {
    p: 0,
    pl: 0,
    m: 0,
    width: "100%",
    listStyle: "none",
  },
  "& li": {
    flexGrow: 2,
    p: 0,
    m: 0,
    borderBottom: "1px solid transparent",
    "&:nth-last-of-type(n+2):not(:hover)": {
      borderBottom: "1px solid $shadowLight",
    },
  },
  overflow: "scroll",
})

const ListControls = styled.div({
  display: "flex",
  pt: "$2",
  pb: "$3",
  justifyContent: "space-between",
})

const ListControlsGroup = styled.div({
  display: "flex",
  alignItems: "center",
  fontSize: "$1",
  fontWeight: "normal",
  "& select": {
    ml: "$1",
    height: 40,
    lineHeight: 1,
    borderRadius: "$1",
    "&:hover": {
      bg: "$shadowLight",
    },
  },
  "& input": {
    ml: "$1",
    height: 40,
    borderRadius: "$1",
    fontSize: "$1",
    width: 200,
  },
})

const ControlsContainer = styled.div({
  gridArea: "controls",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  borderBottom: "2px solid $shadow",
})

const ProjectLink = styled.div({
  display: "flex",
  alignItems: "center",
  borderRadius: "$2",
  px: "$3",
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
