import useCode from "hooks/useCode"
import * as React from "react"
import { render } from "react-dom"

export default function UseCodeTest() {
  const [current, setCurrent] = React.useState(Object.keys(reactFiles)[0])
  const [files, setFiles] = React.useState(reactFiles)

  const { previewRef, code } = useCode({
    files,
    entry: "index",
    scope: {
      render,
    },
    dependencies: {
      react: React,
    },
  })
  return (
    <div style={{ padding: 16 }}>
      <h1>Hello</h1>
      {Object.keys(files).map((key, i) => (
        <button key={i} onClick={() => setCurrent(key)}>
          {key}
        </button>
      ))}
      <div style={{ display: "flex" }}>
        <textarea
          value={files[current]}
          onChange={(e) => {
            setFiles({ ...files, [current]: e.currentTarget.value })
          }}
          style={{ height: 400, width: 400 }}
        ></textarea>
        <textarea
          value={code}
          disabled
          style={{ height: 400, width: 400 }}
        ></textarea>
        <div
          ref={previewRef}
          style={{ height: 400, width: 400, border: "1px solid blue" }}
        ></div>
      </div>
    </div>
  )
}

const reactFiles = {
  index: `
import * as React from "react"
import { name } from "./name"

function App() {
return <div>Hello {name}!</div>
}
 
render(<App/>, elm)
`,
  name: `
export const name = "Steve"
`,
}
