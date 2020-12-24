import * as React from "react"
import prettier from "prettier/standalone"
import parser from "prettier/parser-typescript"
import { useEditor, useMonacoContext } from "use-monaco"
import useTheme from "./useTheme"

export default function useCustomEditor(
  model: any,
  readOnly: boolean,
  onChange: (code: string) => void,
) {
  const { theme } = useTheme()
  const { monaco } = useMonacoContext()

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
      scrollbar: {
        verticalScrollbarSize: 0,
        verticalSliderSize: 8,
        horizontalScrollbarSize: 0,
        horizontalSliderSize: 8,
      },
      renderLineHighlight: "none",
      // renderIndentGuides: false,
      cursorWidth: 3,
    },
    editorDidMount: (editor) => {
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
    },
    onChange,
  })

  React.useEffect(() => {
    if (!(monaco && editor)) return

    // setup prettier formatter
    const prettierFormatter = {
      provideDocumentFormattingEdits(model) {
        try {
          const text = prettier.format(model.getValue(), {
            parser: "typescript",
            plugins: [parser],
            semi: false,
            trailingComma: "es5",
            tabWidth: 2,
          })

          const range = model.getFullModelRange()

          return [{ range, text }]
        } catch (e) {
          return []
        }
      },
    }
    monaco.languages.registerDocumentFormattingEditProvider(
      "javascript",
      prettierFormatter,
    )
    monaco.languages.registerDocumentFormattingEditProvider(
      "typescript",
      prettierFormatter,
    )
  }, [monaco, editor])

  React.useEffect(() => {
    if (!monaco) return
    monaco.editor.setTheme(theme)
  }, [monaco, editor, theme])

  return { editor, containerRef }
}
