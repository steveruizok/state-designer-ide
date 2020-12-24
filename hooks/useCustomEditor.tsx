import * as React from "react"
import { useEditor } from "use-monaco"
import mergeRefs from "react-merge-refs"
import useTheme from "./useTheme"
import debounce from "lodash/debounce"
import useMotionResizeObserver from "use-motion-resize-observer"

export default function useCustomEditor(
  monaco: any,
  model: any,
  readOnly: boolean,
  wrap: boolean,
  onChange: (code: string) => void,
) {
  const { theme } = useTheme()

  const { editor, containerRef } = useEditor({
    monaco,
    model,
    options: {
      fontSize: 13,
      showUnused: false,
      quickSuggestions: false,
      fontFamily: "Fira Code",
      fontWeight: "500",
      minimap: { enabled: false },
      smoothScrolling: true,
      lineDecorationsWidth: 4,
      fontLigatures: true,
      cursorBlinking: "smooth",
      lineNumbers: "off",
      scrollBeyondLastLine: false,
      wordWrap: wrap ? "on" : "off",
      scrollbar: {
        verticalScrollbarSize: 0,
        verticalSliderSize: 8,
        horizontalScrollbarSize: 0,
        horizontalSliderSize: 8,
      },
      renderLineHighlight: "all",
      cursorWidth: 3,
    },
    editorDidMount: (editor) => {
      editor.updateOptions({
        readOnly,
      })

      editor.onKeyDown((e) => {
        if (e.metaKey) {
          if (e.code === "KeyA") {
            // e.preventDefault()
            // const range = editor.getModel().getFullModelRange()
            // editor.setSelection(range)
          }
        }
      })
    },
    onChange,
  })

  React.useEffect(() => {
    if (!monaco) return
    monaco.editor.setTheme(theme)
  }, [monaco, editor, theme])

  // Resizing
  const resizeEditor = React.useCallback(
    debounce(() => {
      editor?.layout()
    }, 48),
    [editor],
  )

  const { ref: resizeRef } = useMotionResizeObserver<HTMLDivElement>({
    onResize: resizeEditor,
  })

  React.useEffect(() => {
    if (editor) {
      editor.updateOptions({
        readOnly,
      })
    }
  }, [editor, readOnly])

  React.useEffect(() => {
    if (editor) {
      editor.updateOptions({
        wordWrap: wrap ? "on" : "off",
      })
    }
  }, [editor, wrap])

  return { editor, containerRef: mergeRefs([resizeRef, containerRef]) }
}
