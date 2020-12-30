import * as React from "react"
import * as Types from "types"

import {
  Button,
  Heading4,
  IconButton,
  Input,
  Label,
  Select,
  Text,
  styled,
} from "components/theme"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { Home, MoreHorizontal, Sun, X } from "react-feather"
import { getCurrentUser, redirectToAuthPage } from "lib/auth-server"
import {
  getUserProjects,
  setCustomToken,
  subscribeToProjects,
} from "lib/database"
import { login, logout } from "lib/auth-client"

import Head from "next/head"
import Link from "next/link"
import { Trigger } from "@radix-ui/react-dialog"
import dialogState from "states/dialog"
import { single } from "utils"
import useTheme from "hooks/useTheme"

let INITIAL_SORT = "Date"
let INITIAL_SORT_DIRECTION = "Descending"

interface UserNotFoundProps {
  isUser: false
}

interface UserFoundProps {
  uid: string
  oid: string
  token: string
  isUser: true
  user: Types.User
  projects: Types.ProjectData[]
}

type UserPageProps = UserFoundProps | UserNotFoundProps

export default function UserPage(props: UserPageProps) {
  if (!props.isUser) return null

  const { uid, oid, token } = props

  const { toggle } = useTheme()
  const [user, setUser] = React.useState(props.user)
  const [projects, setProjects] = React.useState(props.projects)

  React.useEffect(() => {
    let unsub: any

    setCustomToken(token)

    subscribeToProjects(uid, oid, (projects) => {
      setProjects(projects)
    }).then((cb) => (unsub = cb))
    return () => {
      unsub && unsub()
    }
  }, [])

  const [sortBy, setSortBy] = React.useState(INITIAL_SORT)
  const [sortDirection, setSortDirection] = React.useState(
    INITIAL_SORT_DIRECTION,
  )
  const [filter, setFilter] = React.useState(null)

  console.log(projects)

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
              value={filter}
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
          {sortedProjects.length > 0 ? (
            sortedProjects.map(({ id, name, dateCreated, lastModified }, i) => (
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
                  <Select
                    value={"Options"}
                    onChange={(e) => {
                      const project = projects.find((p) => p.id === id)

                      switch (e.currentTarget.value) {
                        case "Rename": {
                          dialogState.send("OPENED_PROJECT_RENAME_DIALOG", {
                            project,
                          })
                          break
                        }
                        case "Duplicate": {
                          dialogState.send("OPENED_PROJECT_DUPLICATE_DIALOG", {
                            project,
                          })
                          break
                        }
                        case "Delete": {
                          dialogState.send("OPENED_PROJECT_DELETE_DIALOG", {
                            project,
                          })
                          break
                        }
                      }
                    }}
                  >
                    <option disabled>Options</option>
                    <option>Rename</option>
                    <option>Duplicate</option>
                    <option>Delete</option>
                  </Select>
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

  const {
    query: { oid },
  } = context

  const { uid } = authState.user
  const data = await getUserProjects(single(oid), uid)

  return {
    props: {
      isUser: true,
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
  gridTemplateRows: "40px 1fr",
  gridTemplateColumns: "320px 1fr",
  gridTemplateAreas: `
		"menu title controls"
		"sidebar main main"
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
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderBottom: "2px solid $shadow",
})

const SidebarContainer = styled.div({
  gridArea: "sidebar",
  display: "flex",
  borderRight: "2px solid $shadow",
})

const MainContainer = styled.div({
  gridArea: "main",
  "& ul": {
    pl: "$3",
    pr: "$1",
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
  pl: "$3",
  justifyContent: "space-between",
})

const ListControlsGroup = styled.div({
  display: "flex",
  alignItems: "center",
  pr: "$1",
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
  borderBottom: "1px solid $shadow",
})

const ProjectLink = styled.div({
  width: "100%",
  display: "flex",
  alignItems: "center",
  "& > p": {
    py: "$2",
  },
  a: {
    ml: "-$2",
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

const StyledTrigger = styled(Trigger, {
  cursor: "pointer",
  bg: "transparent",
  outline: "none",
  border: "none",
  fontFamily: "$body",
  fontSize: "$1",
  color: "$text",
  py: "$2",
  px: "$1",
  height: "100%",
  "&:hover svg": {
    bg: "$shadowLight",
  },
  svg: {
    borderRadius: "$1",
    p: "$1",
    height: 40,
    width: 40,
  },
})
