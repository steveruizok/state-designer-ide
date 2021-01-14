import * as React from "react"
import * as Types from "types"

import {
  Button,
  IconButton,
  Input,
  Select,
  Text,
  styled,
} from "components/theme"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { Home, MoreHorizontal, Sun, X } from "react-feather"
import IconDropdown, {
  DropdownItem,
  DropdownSeparator,
} from "components/icon-dropdown"
import { getCurrentUser, redirectToAuthPage } from "lib/auth-server"
import {
  getUserProjects,
  setCustomToken,
  subscribeToProjects,
} from "lib/database"
import { login, logout } from "lib/auth-client"

import Head from "next/head"
import Link from "next/link"
import ProjectGroup from "components/home/project-group"
import ProjectLink from "components/home/project-link"
import dialogState from "states/dialog"
import { single } from "utils"
import useProjects from "hooks/useProjects"
import useTheme from "hooks/useTheme"
import useUser from "hooks/useUser"
import useUserData from "hooks/useUserData"

let INITIAL_SORT = "Date"
let INITIAL_SORT_DIRECTION = "Descending"

type UserPageProps = {
  uid: string
  oid: string
  token: string
  user: Types.User
  projects: Record<string, Types.ProjectData>
}

export default function UserPage(props: UserPageProps) {
  const { uid, oid, token } = props

  const { toggle } = useTheme()
  const user = useUser() || props.user
  const projects = useProjects(oid) || props.projects
  const userData = useUserData(oid)

  const [sortBy, setSortBy] = React.useState(INITIAL_SORT)
  const [sortDirection, setSortDirection] = React.useState(
    INITIAL_SORT_DIRECTION,
  )
  const [filter, setFilter] = React.useState(null)

  let projectsByGroup = React.useMemo(() => {
    if (!userData) return null
    if (!projects) return null

    let sorter: (a: any, b: any) => number

    if (sortBy === "Name") {
      if (sortDirection === "Descending") {
        sorter = (a, b) => (b.lcName < a.lcName ? -1 : 1)
      } else if (sortDirection === "Ascending") {
        sorter = (a, b) => (a.lcName < b.lcName ? -1 : 1)
      }
    } else if (sortBy === "Date") {
      if (sortDirection === "Descending") {
        sorter = (a, b) => b.lastModified - a.lastModified
      } else if (sortDirection === "Ascending") {
        sorter = (a, b) => a.lastModified - b.lastModified
      }
    }

    let groups = Object.values(userData.groups).map((group) => ({
      ...group,
      projects: group.projectIds
        .map((id) => {
          const p = projects[id]

          if (p === undefined) {
            console.log(id, projects)
          }

          return {
            ...p,
            lcName: p.name.toLowerCase(),
            lastModified: Date.parse(p.lastModified),
            dateCreated: Date.parse(p.dateCreated),
          }
        })
        .filter((p) => (filter ? p.lcName.startsWith(filter) : true))
        .sort(sorter),
    }))

    return groups
  }, [userData, projects, sortBy, sortDirection])

  return (
    <Layout>
      <Head>
        <title>{user.name} - State Designer</title>
      </Head>
      <MenuContainer>
        <Link href={user ? `/u/${user.uid}` : "/"}>
          <IconButton>
            <Home />
          </IconButton>
        </Link>
        {user ? (
          <Button onClick={() => logout()}>Log Out</Button>
        ) : (
          <Button onClick={login}>Log in</Button>
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
        {projectsByGroup ? (
          projectsByGroup.map((group) => (
            <ProjectGroup key={group.id} group={group}>
              <ul>
                {group.projects.length > 0 ? (
                  group.projects.map((project) => (
                    <ProjectLink
                      key={project.id}
                      user={user}
                      project={projects[project.id]}
                      groupId={group.id}
                    />
                  ))
                ) : (
                  <li>
                    <Text variant="ui">This group is empty.</Text>
                  </li>
                )}
              </ul>
            </ProjectGroup>
          ))
        ) : (
          <Text>Loading projects...</Text>
        )}
        <Button
          onClick={() => dialogState.send("OPENED_CREATE_PROJECT_GROUP_DIALOG")}
        >
          Create New Project Group
        </Button>
      </MainContainer>
    </Layout>
  )
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<UserPageProps | { isUser: false }>> {
  const authState = await getCurrentUser(context)

  if (!authState.authenticated) {
    redirectToAuthPage(context)
    return { props: { isUser: false } }
  }

  const {
    query: { oid },
  } = context

  const { uid } = authState.user
  const data = await getUserProjects(single(oid), uid)

  return {
    props: {
      user: authState.user,
      projects: data.projects,
      oid: data.oid,
      uid: authState.user.uid,
      token: authState.token,
    },
  }
}

const Layout = styled.div({
  display: "grid",
  gridTemplateRows: "42px 1fr",
  gridTemplateColumns: "1fr 1fr 1fr",
  gridTemplateAreas: `
		"menu title controls"
		"main main main"
	`,
  minHeight: "100vh",
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
