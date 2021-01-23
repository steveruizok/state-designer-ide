import useCode from "hooks/useCode"
import * as React from "react"
import { render } from "react-dom"
import ErrorBoundary from "components/project/error-boundary"

function UseCodeTest() {
  const rPreview = React.useRef<HTMLDivElement>(null)
  const [current, setCurrent] = React.useState(Object.keys(reactFiles)[0])
  const [files, setFiles] = React.useState(reactFiles)
  const [num, setNum] = React.useState(1)

  const { error, code, status } = useCode({
    files,
    entry: "index",
    scope: {
      elm: rPreview.current,
      render,
      num,
    },
    dependencies: {
      react: React,
    },
  })
  return (
    <div style={{ padding: 16 }}>
      <h1>Esbuild Psuedo-bundler</h1>
      {status}
      <input
        type="number"
        value={num}
        onChange={(e) => setNum(parseInt(e.currentTarget.value))}
      />
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
          ref={rPreview}
          style={{ height: 400, width: 400, border: "1px solid blue" }}
        ></div>
      </div>
      <div style={{ color: "#fff" }}>
        <pre>
          <code>{error}</code>
        </pre>
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

export default function SafeUseCodeTest() {
  return (
    <ErrorBoundary>
      <UseCodeTest />
    </ErrorBoundary>
  )
}
