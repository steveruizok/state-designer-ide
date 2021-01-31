import * as React from "react"
import db from "utils/firestore"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"

import { CanvasControls } from "components/project/chart"
import ChartView from "components/project/chart-view"
import Head from "next/head"
import Router from "next/router"
import { single } from "utils"
import { styled } from "components/theme"

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

export default function ChartPage(props: PageProps) {
  if (!props.isProject) return null
  const { name } = props

  return (
    <Layout>
      <Head>
        <title>{name} - State Designer</title>
      </Head>
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
  [`& ${CanvasControls}`]: {
    visibility: "hidden",
  },
})
