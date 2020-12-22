import * as React from "react"
import Link from "next/link"
import { Home, Sun, Copy, Plus, Minus } from "react-feather"

import { setupOffsets } from "lib/local-data"
import { subscribeToDocSnapshot, forkProject } from "lib/database"
import { login, logout } from "lib/auth-client"
import { User, ProjectData } from "types"
import projectState from "./state"

import { styled, IconButton, Text } from "components/theme"

import {
  DragHandleHorizontalRelative,
  DragHandleVertical,
  DragHandleHorizontal,
} from "./drag-handles"
import Content from "./content"
import Code, { codePanelState } from "./code"
import Details from "./details"
import Console, { CONSOLE_HEIGHT } from "./console"

export const CONTENT_COL_WIDTH = 200
export const CODE_COL_WIDTH = 320
export const DETAILS_ROW_HEIGHT = 320

interface ProjectViewProps {
  pid: string
  oid: string
  user: User
  isOwner: boolean
  authenticated: boolean
  project: ProjectData
}

export default function ProjectView({
  user,
  oid,
  pid,
  isOwner,
}: ProjectViewProps) {
  const rMainContainer = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    setupOffsets()
  }, [])

  React.useEffect(() => {
    return subscribeToDocSnapshot(pid, oid, (doc) => {
      const source = doc.data()
      projectState.send("SOURCE_UPDATED", { source })
    })
  }, [oid, pid])

  return (
    <Layout>
      <MenuContainer>
        <Link href={user ? `/u/${user.uid}` : "/"}>
          <IconButton>
            <Home />
          </IconButton>
        </Link>
        {user ? (
          <button onClick={() => logout()}>Log Out</button>
        ) : (
          <button onClick={login}>Log in</button>
        )}
      </MenuContainer>
      <TitleContainer>Title</TitleContainer>
      <ControlsContainer>
        {user?.authenticated && (
          <IconButton onClick={() => forkProject(pid, oid, user?.uid)}>
            {!isOwner && <Text>Copy Project</Text>}
            <Copy />
          </IconButton>
        )}
        <IconButton>
          <Minus />
        </IconButton>
        <IconButton>
          <Plus />
        </IconButton>
        <IconButton>
          <Sun />
        </IconButton>
      </ControlsContainer>
      <Content>
        <DragHandleHorizontal
          align="left"
          width={CONTENT_COL_WIDTH}
          left={60}
          right={100}
          offset="content"
        />
      </Content>
      <MainContainer>
        <MainDragArea ref={rMainContainer} />
        <ChartContainer>Chart</ChartContainer>
        <ViewContainer>
          View <br />
          {user ? (
            <div>
              Name: {user.name} <br /> Owner? {isOwner.toString()} <br />{" "}
              Authenticated? {user.authenticated.toString()}
            </div>
          ) : (
            <div>Not logged in</div>
          )}
          <Console>
            <DragHandleVertical
              height={CONSOLE_HEIGHT}
              top={580}
              bottom={CONSOLE_HEIGHT - 40}
              offset="console"
              align="bottom"
            />
          </Console>
        </ViewContainer>
        <Details>
          <DragHandleVertical
            height={DETAILS_ROW_HEIGHT}
            top={300}
            bottom={DETAILS_ROW_HEIGHT - 40}
            offset="detail"
            align="bottom"
          />
        </Details>
        <DragHandleHorizontalRelative
          containerRef={rMainContainer}
          offset="main"
        />
      </MainContainer>
      <Code oid={oid} pid={pid} uid={user?.uid} />
    </Layout>
  )
}

const Layout = styled.div({
  display: "grid",
  position: "absolute",
  bg: "$background",
  top: 0,
  left: 0,
  width: "100vw",
  minWidth: "auto",
  maxWidth: "100vw",
  height: "100vh",
  minHeight: "auto",
  overflow: "hidden",
  gridTemplateColumns: `calc(${CONTENT_COL_WIDTH}px + var(--content-offset)) minmax(10%, 1fr) calc(${CODE_COL_WIDTH}px - var(--code-offset))`,
  gridTemplateRows: "40px minmax(0, 1fr)",
  gridTemplateAreas: `
	"menu    title controls"
	"content main  code"`,
})

const MenuContainer = styled.div({
  gridArea: "menu",
  display: "flex",
  alignItems: "center",
  borderBottom: "2px solid $border",
})

const TitleContainer = styled.div({
  gridArea: "title",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  borderBottom: "2px solid $border",
})

const ControlsContainer = styled.div({
  gridArea: "controls",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  borderBottom: "2px solid $border",
})

const MainContainer = styled.div({
  position: "relative",
  gridArea: "main",
  display: "grid",
  minHeight: "auto",
  minWidth: "auto",
  maxWidth: "100%",
  maxHeight: "100%",
  overflow: "hidden",
  gridTemplateAreas: `"chart view" "details view"`,
  gridTemplateColumns: `calc(50% + var(--main-offset)) minmax(15%, 1fr)`,
  gridTemplateRows: `minmax(0, 1fr) min(100%, calc(${DETAILS_ROW_HEIGHT}px - var(--detail-offset)))`,
})

const MainDragArea = styled.div({
  position: "absolute",
  top: 0,
  left: "10%",
  width: "80%",
  height: "100%",
})

const ChartContainer = styled.div({
  position: "relative",
  gridArea: "chart",
  display: "grid",
  borderRight: "2px solid $border",
})

const ViewContainer = styled.div({
  gridArea: "view",
  position: "relative",
})
