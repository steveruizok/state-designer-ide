import * as React from "react"
import {
  styled,
  Heading4,
  Select,
  Text,
  IconButton,
  Input,
  Button,
} from "components/theme"
import { Home, Sun } from "react-feather"
import { logout, login } from "lib/auth-client"
import { getCurrentUser, redirectToAuthPage } from "lib/auth-server"
import { getUserProjects } from "lib/database"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import Link from "next/link"
import Head from "next/head"
import useTheme from "hooks/useTheme"
import * as Types from "types"

let INITIAL_SORT = "Date"
let INITIAL_SORT_DIRECTION = "Descending"

interface UserNotFoundProps {
  isUser: false
}

interface UserFoundProps {
  isUser: true
  user: Types.User
  projects: Types.ProjectData[]
}

type UserPageProps = UserFoundProps | UserNotFoundProps

export default function UserPage(props: UserPageProps) {
  if (!props.isUser) return null
  const [sortBy, setSortBy] = React.useState(INITIAL_SORT)
  const [sortDirection, setSortDirection] = React.useState(
    INITIAL_SORT_DIRECTION,
  )
  const [filter, setFilter] = React.useState(null)

  const { toggle } = useTheme()
  const { user, projects } = props

  let sortedProjects = projects.map((p) => ({
    ...p,
    lcName: p.name.toLowerCase(),
    lastModified: Date.parse(p.lastModified),
    dateCreated: Date.parse(p.dateCreated),
  }))

  if (filter) {
    sortedProjects = sortedProjects.filter((p) => p.lcName.startsWith(filter))
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
      <ControlsContainer>
        <IconButton onClick={toggle}>
          <Sun />
        </IconButton>
      </ControlsContainer>
      <Title>{user.name}</Title>
      <ControlsContainer></ControlsContainer>
      <SidebarContainer></SidebarContainer>
      <MainContainer>
        <ListControls>
          <ListControlsGroup>
            <Text variant="ui">Sort by</Text>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option>Date</option>
              <option>Name</option>
            </Select>
            <Select
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
            >
              <option>Ascending</option>
              <option>Descending</option>
            </Select>
          </ListControlsGroup>
          <ListControlsGroup>
            <Input
              value={filter}
              onChange={(e) => setFilter(e.currentTarget.value)}
              placeholder="Filter"
            />
          </ListControlsGroup>
        </ListControls>
        <ul>
          {sortedProjects.length > 0 ? (
            sortedProjects.map(({ id, name, dateCreated, lastModified }) => (
              <li key={id}>
                <ProjectLink>
                  <Link href={`/u/${user.uid}/p/${id}`}>
                    <a>
                      <Heading4>{name}</Heading4>
                      <Text variant="ui">
                        Last modified{" "}
                        {new Date(lastModified).toLocaleDateString()} - Created{" "}
                        {new Date(dateCreated).toLocaleDateString()}
                      </Text>
                    </a>
                  </Link>
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

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<UserPageProps>> {
  const authState = await getCurrentUser(context)

  if (!authState.authenticated) {
    redirectToAuthPage(context)
    return { props: { isUser: false } }
  }

  const { uid } = authState.user
  const data = await getUserProjects(uid, uid)

  return {
    props: { isUser: true, user: authState.user, projects: data.projects },
  }
}

const Layout = styled.div({
  display: "grid",
  gridTemplateRows: "40px 1fr",
  gridTemplateColumns: "320px 1fr",
  gridTemplateAreas: `
		"menu title controls"
		"sidebar main main"
	`,
})

const MenuContainer = styled.div({
  gridArea: "menu",
  display: "flex",
  alignItems: "center",
})

const Title = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})

const SidebarContainer = styled.div({
  gridArea: "sidebar",
  display: "flex",
})

const MainContainer = styled.div({
  gridArea: "main",
  "& ul": {
    p: 0,
    m: 0,
    width: "100%",
    listStyle: "none",
  },
  "& li": {
    flexGrow: 2,
    p: 0,
    m: 0,
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
  px: "$2",
  "& select": {
    ml: "$1",
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
})

const ProjectLink = styled.div({
  width: "100%",
  display: "flex",
  "& > p": {
    px: "$2",
    py: "$2",
  },
  a: {
    px: "$2",
    py: "$2",
    borderRadius: "$2",
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
      bg: "$shadowLight",
      h4: { color: "$accent" },
      [`${Text}:nth-of-type(1)`]: {
        opacity: 0.8,
      },
    },
  },
})
