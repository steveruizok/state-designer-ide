import * as React from "react"
import * as Types from "types"

import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { getProjectData, getProjectExists } from "lib/database"

import { getCurrentUser } from "lib/auth-server"
import { single } from "utils"

interface ScreenshotPageProps {
  src: string
}

export default function ScreenshotPage({ src }: ScreenshotPageProps) {
  return <img src={`data:image/gif;base64,${src}`} alt="screenshot" />
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ScreenshotPageProps>> {
  const { oid, pid } = context.query

  var path = `/api/u/${oid}/p/${pid}/screenshot/chart`
  var url = process.env.NEXT_PUBLIC_BASE_API_URL + path
  const res = await fetch(url).then((d) => d.json())

  return {
    props: {
      src: res.src,
    },
  }
}
