import * as React from "react"

import { Button, IconButton, styled } from "components/theme"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"

import ChartView from "components/project/chart-view"
import Head from "next/head"
import Link from "next/link"
import Router from "next/router"
import { Sun } from "react-feather"
import { getProjectData } from "lib/database"
import projectState from "states/project"
import { single } from "utils"
import { subscribeToProject } from "lib/database"
import useTheme from "hooks/useTheme"

interface CharPageProps {
  oid: string
  pid: string
  name: string
  isProject: true
  showConsole: boolean
}

interface ProjectNotFoundPageProps {
  isProject: false
}

type ProjectPageProps = CharPageProps | ProjectNotFoundPageProps

export default function ProjectPage(props: ProjectPageProps) {
  if (!props.isProject) return null
  const { oid, pid, name } = props

  const rUnsub = React.useRef<any>()

  React.useEffect(() => {
    function handleRouteChange() {
      projectState.send("UNLOADED")
      rUnsub.current?.()
    }

    // Subscribe to the firebase document on mount.
    subscribeToProject(pid, oid, (source) => {
      projectState.send("SOURCE_UPDATED", {
        source,
        oid,
        pid,
      })
    }).then((unsub) => (rUnsub.current = unsub))

    // Cleanup the project when when we leave this route, even if we
    // change to a different project.
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
        <Link href={`/u/${oid}/p/${pid}/view`}>
          <Button>View</Button>
        </Link>
        <Spacer />
        <IconButton title="Toggle Dark Mode" onClick={toggle}>
          <Sun />
        </IconButton>
      </NavContainer>
      <ChartView />
    </Layout>
  )
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProjectPageProps>> {
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
  gridTemplateAreas: `
	"chart"`,
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
