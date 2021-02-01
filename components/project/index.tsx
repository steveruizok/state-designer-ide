import * as React from "react"
import useUser from "hooks/useUser"

import ProjectMeta from "components/project-meta"
import ContentPanel from "./content-panel"
import DetailsPanel, { DETAILS_ROW_HEIGHT } from "./details-panel"
import useProject from "hooks/useProject"
import { motionValues } from "lib/local-data"

import ChartView from "./chart-view"
import CodePanel from "./code-panel"
import Console from "./console-panel"
import Controls from "./controls"
import { DragHandleHorizontalRelative } from "./drag-handles"
import LiveView from "./live-view"
import Menu from "./menu"
import Title from "./title"
import projectState from "states/project"
import { styled } from "components/theme"
import MonacoProvider from "components/monaco-provider"

export const CODE_COL_WIDTH = 320

interface ProjectProps {
  oid: string
  pid: string
}

function Project({ oid, pid }: ProjectProps) {
  const rMainContainer = React.useRef<HTMLDivElement>(null)
  const user = useUser()

  const { project } = useProject(pid, oid)

  React.useEffect(() => {
    projectState.send("SOURCE_UPDATED", {
      source: project,
      oid,
      pid,
    })
  }, [project])

  return (
    <MonacoProvider>
      <Layout>
        <ProjectMeta oid={oid} pid={pid} />
        <TitleRow>
          <Menu />
          <Title pid={pid} oid={oid} readOnly={oid !== user.id} />
          <Controls oid={oid} pid={pid} uid={user.id} />
        </TitleRow>
        <BodyRow>
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
          <CodePanel oid={oid} pid={pid} uid={user.id} />
        </BodyRow>
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
  gridTemplateRows: "40px minmax(0, 1fr)",
})

const TitleRow = styled.div({
  display: "grid",
  gridTemplateAreas: '"menu title controls"',
  alignItems: "center",
})

const BodyRow = styled.div({
  display: "grid",
  maxHeight: "100%",
  minHeight: "auto",
  overflow: "hidden",
  gridTemplateAreas: `"content main  code"`,
  gridTemplateColumns: `auto minmax(10%, 1fr) calc(${CODE_COL_WIDTH}px - var(--code-offset))`,
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

export default React.memo(Project)
