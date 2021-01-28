import useTranspiledEval from "hooks/useCompiler"
import * as React from "react"
import { render } from "react-dom"
import ErrorBoundary from "components/project/error-boundary"

function UseCodeTest() {
  const rPreview = React.useRef<HTMLDivElement>(null)
  const [num, setNum] = React.useState(1)
  const [current, setCurrent] = React.useState("index")
  const [files, setFiles] = React.useState({
    index: `
import * as React from "react"
import { name } from "./name"

function App() {
  return (
    <div>
      <h2>Hello {name}!</h2>
      <div>The number is {num}!</div>
    </div>
  )
}
	
render(<App/>, elm)
	`,
    name: `
export const name = "Miranda"
	`,
  })

  const { error, modules, status } = useTranspiledEval({
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
      <h1>In browser packer with sucrase</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 200px",
          width: "fit-content",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <div>Status:</div>
        <div>{status}</div>
        <div>Number: </div>
        <input
          type="number"
          value={num}
          onChange={(e) => setNum(parseInt(e.currentTarget.value))}
        />
        <div>Files:</div>
        <div>
          {Object.keys(files).map((key, i) => (
            <button key={i} onClick={() => setCurrent(key)}>
              {key}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex" }}>
        <textarea
          value={files[current]}
          onChange={(e) => {
            setFiles({ ...files, [current]: e.currentTarget.value })
          }}
          style={{ height: 400, width: 400 }}
        ></textarea>
        <textarea
          value={modules[current] as any}
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

export default function SafeUseCodeTest() {
  return (
    <ErrorBoundary>
      <UseCodeTest />
    </ErrorBoundary>
  )
}
