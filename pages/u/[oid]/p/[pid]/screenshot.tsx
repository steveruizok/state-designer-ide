import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import * as React from "react"

interface ScreenshotPageProps {
  pid: string
  oid: string
}

export default function ScreenshotPage({ oid, pid }: ScreenshotPageProps) {
  return (
    <div>
      <img
        src={`https://storage.googleapis.com/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/screenshots/${oid}-${pid}.jpg`}
        alt="screenshot"
      />
    </div>
  )
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ScreenshotPageProps>> {
  const { oid, pid } = context.query

  return {
    props: {
      oid: oid.toString(),
      pid: pid.toString(),
    },
  }
}
