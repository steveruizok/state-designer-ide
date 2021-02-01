import * as React from "react"

import debounce from "lodash/debounce"
import mergeRefs from "react-merge-refs"
import { useEditor } from "lib/use-monaco/cjs/use-monaco"
import useMotionResizeObserver from "use-motion-resize-observer"
import useTheme from "./useTheme"

interface UseCustomEditorOptions {
  monaco: any
  model: any
  readOnly?: boolean
  wordWrap?: boolean
  minimap?: boolean
  fontSize?: number
  onMount?: (editor: any) => void
  onChange?: (code: string) => void
}

export default function useCustomEditor({
  monaco,
  model,
  onMount,
  onChange,
  readOnly = true,
  wordWrap = false,
  minimap = true,
  fontSize = 13,
}: UseCustomEditorOptions) {
  const { theme } = useTheme()

  const { editor, containerRef } = useEditor({
    monaco,
    model,
    options: {
      readOnly,
      wordWrap: wordWrap ? "on" : "off",
      minimap: {
        enabled: minimap,
        renderCharacters: false,
      },
      fontSize,
      showUnused: false,
      quickSuggestions: false,
      fontFamily: "Fira Code",
      fontWeight: "$1",
      smoothScrolling: true,
      lineDecorationsWidth: 4,
      fontLigatures: true,
      cursorBlinking: "smooth",
      lineNumbers: "off",
      scrollBeyondLastLine: true,
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
      resizeEditor()
      editor.updateOptions({
        readOnly,
        wordWrap: wordWrap ? "on" : "off",
        minimap: {
          enabled: minimap,
          renderCharacters: false,
        },
        fontSize,
      })
    }
  }, [editor, wordWrap, fontSize, readOnly])

  return { editor, containerRef: mergeRefs([resizeRef, containerRef]) }
}
