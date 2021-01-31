import * as React from "react"
import db from "utils/firestore"
import { Button, IconButton, styled } from "components/theme"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"

import ChartView from "components/project/chart-view"
import Head from "next/head"
import Link from "next/link"
import { Sun } from "react-feather"
import { single } from "utils"
import useTheme from "hooks/useTheme"

interface ChartPageProps {
  oid: string
  pid: string
  name: string
  isProject: true
}

interface ProjectNotFoundPageProps {
  isProject: false
}

type PageProps = ChartPageProps | ProjectNotFoundPageProps

export default function ProjectPage(props: PageProps) {
  if (!props.isProject) return null
  const { oid, pid, name } = props
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
): Promise<GetServerSidePropsResult<PageProps>> {
  const { oid, pid } = context.query

  const project = await db
    .collection("users")
    .doc(single(oid))
    .collection("projects")
    .doc(single(pid))
    .get()

  if (!project.exists) {
    context.res.setHeader("Location", `/u/${oid}/p/${pid}/not-found`)
    context.res.statusCode = 307
    return {
      props: { isProject: false },
    }
  }
  return {
    props: {
      oid: single(oid),
      pid: single(pid),
      name: project.data().name,
      isProject: true,
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
