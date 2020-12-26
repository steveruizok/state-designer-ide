import * as React from "react"
import { useEditor } from "use-monaco"
import mergeRefs from "react-merge-refs"
import debounce from "lodash/debounce"
import useMotionResizeObserver from "use-motion-resize-observer"

export default function useCustomEditor(
  monaco: any,
  model: any,
  readOnly: boolean,
  wrap: boolean,
  onMount?: (editor: any) => void,
  onChange?: (code: string) => void,
) {
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
      readOnly,
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
    onEditorDidMount: (editor) => {
      editor.updateOptions({
        readOnly,
      })

      editor.onKeyDown((e) => {
        if (e.metaKey) {
          if (e.code === "KeyA") {
            e.preventDefault()
            const range = editor.getModel().getFullModelRange()
            editor.setSelection(range)
          }
        }
      })

      onMount && onMount(editor)
    },
    onChange: (value) => {
      onChange && onChange(value)
    },
  })

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

  return { editor, containerRef: mergeRefs([resizeRef, containerRef]) }
}
