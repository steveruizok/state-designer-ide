import MonacoProvider from "components/monaco-provider"
import { styled } from "components/theme"
import {
  checkAuth,
  saveProjectSocialScreenshot,
  setCustomToken,
  subscribeToProject,
} from "lib/database"
import { motionValues, updatePanelOffsets } from "lib/local-data"
import Router from "next/router"
import * as React from "react"
import codePanelState from "states/code-panel"
import projectState from "states/project"
import * as Types from "types"

import ChartView from "./chart-view"
import CodePanel from "./code-panel"
import Console from "./console-panel"
import ContentPanel, { CONTENT_COL_WIDTH } from "./content-panel"
import Controls from "./controls"
import DetailsPanel, { DETAILS_ROW_HEIGHT } from "./details-panel"
import { DragHandleHorizontalRelative } from "./drag-handles"
import LiveView from "./live-view"
import Menu from "./menu"
import Title from "./title"

export const CODE_COL_WIDTH = 320

interface ProjectViewProps {
  oid: string
  pid: string
  uid?: string
  user: Types.User
  token?: string
  isOwner?: boolean
  projectData: Types.ProjectData
}

export default function ProjectView({
  oid,
  pid,
  uid,
  user,
  token,
  isOwner,
  projectData,
}: ProjectViewProps) {
  const rMainContainer = React.useRef<HTMLDivElement>(null)
  const rUnsub = React.useRef<any>()

  React.useEffect(() => {
    function handleRouteChange() {
      projectState.send("UNLOADED")
      codePanelState.send("UNLOADED")
      rUnsub.current?.()
    }

    setCustomToken(token)

    // Subscribe to the firebase document on mount.
    subscribeToProject(pid, oid, (source) => {
      projectState.send("SOURCE_UPDATED", {
        source,
        oid,
        pid,
      })
    }).then((unsub) => (rUnsub.current = unsub))

    // Consider removing this—we'll get the custom token when we need it.
    checkAuth()

    // Let's make sure that the panels are set up right, too.
    updatePanelOffsets()

    // Cleanup the project when when we leave this route, even if we
    // change to a different project.
    Router.events.on("routeChangeStart", handleRouteChange)

    // Save a screenshot every five minutes
    saveProjectSocialScreenshot(oid, pid).then((url) => {
      console.log("saved social screenshot to", url)
    })

    let interval = setInterval(() => {
      saveProjectSocialScreenshot(oid, pid)
    }, 60 * 5 * 1000)

    return () => {
      clearInterval(interval)
      saveProjectSocialScreenshot(oid, pid)
      Router.events.off("routeChangeStart", handleRouteChange)
      handleRouteChange()
    }
  }, [oid, pid])

  return (
    <MonacoProvider>
      v
      <Layout>
        <Menu user={user} />
        <Title pid={pid} oid={oid} readOnly={oid !== uid} />
        <Controls oid={oid} pid={pid} uid={uid} />
        <ContentPanel />
        <MainContainer>
          <ChartView />
          <MainDragArea ref={rMainContainer} />
          <LiveViewContainer>
            <LiveView />
            <Console />
          </LiveViewContainer>
          <DetailsPanel />
          <DragHandleHorizontalRelative
            motionValue={motionValues.main}
            containerRef={rMainContainer}
            offset="main"
          />
        </MainContainer>
        <CodePanel oid={oid} pid={pid} uid={uid} />
      </Layout>
    </MonacoProvider>
  )
}

const Layout = styled.div({
  display: "grid",
  position: "fixed",
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

const LiveViewContainer = styled.div({
  gridArea: "view",
  position: "relative",
  "&:focus-within:after": {
    content: "''",
    position: "absolute",
    top: 8,
    right: 8,
    height: 8,
    width: 8,
    borderRadius: 8,
    bg: "$text",
    zIndex: 99999,
  },
})
