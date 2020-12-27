import { Button, IconButton, Text, styled } from "components/theme"
import useTheme from "hooks/useTheme"
import { login, logout } from "lib/auth-client"
import {
  forkProject,
  setCustomToken,
  subscribeToDocSnapshot,
} from "lib/database"
import { motionValues } from "lib/local-data"
import Link from "next/link"
import Router from "next/router"
import * as React from "react"
import { Copy, Home, Minus, Plus, Sun } from "react-feather"
import codePanelState from "states/code-panel"
import projectState from "states/project"
import { ProjectData, User } from "types"

import Chart from "./chart-view"
import CodePanel from "./code-panel"
import Console from "./console-panel"
import ContentPanel, { CONTENT_COL_WIDTH } from "./content-panel"
import DetailsPanel, { DETAILS_ROW_HEIGHT } from "./details-panel"
import { DragHandleHorizontalRelative } from "./drag-handles"
import LiveView from "./live-view"
import Title from "./title"

export const CODE_COL_WIDTH = 320

interface ProjectViewProps {
  token: string
  pid: string
  oid: string
  user: User
  isOwner: boolean
  authenticated: boolean
  project: ProjectData
}

export default function ProjectView({
  token,
  user,
  oid,
  pid,
  isOwner,
}: ProjectViewProps) {
  const { toggle } = useTheme()
  const rMainContainer = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setCustomToken(token)
  }, [token])

  React.useEffect(() => {
    return subscribeToDocSnapshot(pid, oid, (doc) => {
      const source = doc.data()
      projectState.send("SOURCE_UPDATED", { source, oid, pid })
    })
  }, [oid, pid])

  React.useEffect(() => {
    function handleRouteChange() {
      projectState.send("UNLOADED")
      codePanelState.send("UNLOADED")
    }

    Router.events.on("routeChangeStart", handleRouteChange)
    return () => {
      Router.events.off("routeChangeStart", handleRouteChange)
      projectState.send("UNLOADED")
      codePanelState.send("UNLOADED")
    }
  }, [])

  return (
    <Layout>
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
      <Title readOnly={!isOwner} />
      <ControlsContainer>
        {user?.authenticated && (
          <IconButton onClick={() => forkProject(pid, oid, user?.uid)}>
            {!isOwner && <Text>Copy Project</Text>}
            <Copy />
          </IconButton>
        )}
        <IconButton onClick={() => codePanelState.send("DECREASED_FONT_SIZE")}>
          <Minus />
        </IconButton>
        <IconButton onClick={() => codePanelState.send("INCREASED_FONT_SIZE")}>
          <Plus />
        </IconButton>
        <IconButton onClick={toggle}>
          <Sun />
        </IconButton>
      </ControlsContainer>
      <ContentPanel />
      <MainContainer>
        <Chart />
        <MainDragArea ref={rMainContainer} />
        <ViewContainer>
          <LiveView />
          <Console />
        </ViewContainer>
        <DetailsPanel />
        <DragHandleHorizontalRelative
          motionValue={motionValues.main}
          containerRef={rMainContainer}
          offset="main"
        />
      </MainContainer>
      <CodePanel oid={oid} pid={pid} uid={user?.uid} />
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
  maxWidth: "100vw",
  minWidth: "auto",
  height: "100vh",
  maxHeight: "100%",
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
})

const ControlsContainer = styled.div({
  gridArea: "controls",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
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
  bg: "$border",
})

const MainDragArea = styled.div({
  userSelect: "none",
  pointerEvents: "none",
  position: "absolute",
  top: 0,
  left: "10%",
  width: "80%",
  height: "100%",
})

const ViewContainer = styled.div({
  gridArea: "view",
  position: "relative",
})

// function MovingPanel() {
//   const offsetY = useTransform(
//     [motionValues.detail, motionValues.console],
//     ([d, c]: number[]) => {
//       return Math.min(d - c)
//     },
//   )
//   const height = useTransform(
//     [motionValues.detail, motionValues.console],
//     ([d, c]: number[]) => {
//       return Math.abs(d - c)
//     },
//   )
//   return <MovingPanelBorder style={{}} />
// }

// const MovingPanelBorder = styled(motion.div, {
//   bg: "$borderContrast",
//   width: 2,
//   pointerEvents: "none",
// })
