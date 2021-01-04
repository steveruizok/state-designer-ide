import * as React from "react"

import { Button, IconButton, styled } from "components/theme"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"

import Console from "components/project/console-panel"
import Head from "next/head"
import Link from "next/link"
import LiveView from "components/project/live-view"
import Router from "next/router"
import { Sun } from "react-feather"
import { getProjectData } from "lib/database"
import projectState from "states/project"
import { single } from "utils"
import { subscribeToProject } from "lib/database"
import { updatePanelOffsets } from "lib/local-data"
import useTheme from "hooks/useTheme"

interface ViewPageProps {
  oid: string
  pid: string
  name: string
  isProject: true
  showConsole: boolean
}

interface ProjectNotFoundPageProps {
  isProject: false
}

type PageProps = ViewPageProps | ProjectNotFoundPageProps

export default function ProjectPage(props: PageProps) {
  if (!props.isProject) return null

  const { oid, pid, name, showConsole } = props

  const rUnsub = React.useRef<any>()

  React.useEffect(() => {
    function handleRouteChange() {
      projectState.send("UNLOADED")
      rUnsub.current?.()
    }

    subscribeToProject(pid, oid, (source) => {
      projectState.send("SOURCE_UPDATED", {
        source,
        oid,
        pid,
      })
    }).then((unsub) => (rUnsub.current = unsub))

    updatePanelOffsets()

    Router.events.on("routeChangeStart", handleRouteChange)

    return () => {
      Router.events.off("routeChangeStart", handleRouteChange)
      handleRouteChange()
    }
  }, [oid, pid])

  const { toggle } = useTheme()

  return (
    <Layout>
      <Head>
        <title>{name} - State Designer</title>
      </Head>
      <NavContainer>
        <Link href={`/u/${oid}/p/${pid}`}>
          <Button>Back to Project</Button>
        </Link>
        <Link href={`/u/${oid}/p/${pid}/chart`}>
          <Button>Chart</Button>
        </Link>
        <Spacer />
        <IconButton title="Toggle Dark Mode" onClick={toggle}>
          <Sun />
        </IconButton>
      </NavContainer>
      <LiveView showConsole={showConsole} />
      {showConsole && <Console />}
    </Layout>
  )
}
export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PageProps>> {
  const { oid, pid, console } = context.query

  const projectData = await getProjectData(single(pid), single(oid))

  if (!projectData) {
    context.res.setHeader("Location", `/u/${oid}/p/${pid}/not-found`)
    context.res.statusCode = 307
    return {
      props: { isProject: false },
    }
  }

  ;(projectData as any).timestamp = null

  return {
    props: {
      oid: single(oid),
      pid: single(pid),
      name: projectData.name,
      isProject: true,
      showConsole: console === "true",
    },
  }
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
  gridTemplateColumns: `1fr`,
  gridTemplateRows: "minmax(0, 1fr)",
})

const NavContainer = styled.nav({
  position: "absolute",
  top: 0,
  left: 0,
  display: "flex",
  zIndex: 999999,
  width: "100%",
  height: 40,
})

const Spacer = styled.div({
  flexGrow: 2,
})
