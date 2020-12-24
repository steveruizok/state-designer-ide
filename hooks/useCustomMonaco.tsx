import * as React from "react"
import prettier from "prettier/standalone"
import parser from "prettier/parser-typescript"
import { useMonaco } from "use-monaco"
import useTheme from "./useTheme"

// setup prettier formatter
const prettierFormatter = {
  provideDocumentFormattingEdits(model: any) {
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

export default function useCustomMonaco(language: "json" | "typescript") {
  const { theme } = useTheme()

  const { monaco, isLoading } = useMonaco({
    plugins: {
      prettier: [language],
      typings: true,
    },
    theme: theme === "light" ? "light" : "dark",
    onLoad: (monaco) => {
      if (monaco === null) return

      monaco.editor.defineTheme("light", {
        base: "vs",
        inherit: true,
        rules: [],
        colors: {
          "editor.lineHighlightBorder": "#77777700",
          "editor.lineHighlightBackground": "#77777711",
          "editorBracketMatch.border": "#00000000",
          "editorBracketMatch.background": "#00000022",
          "editorIndentGuide.background": "#ffffff00",
        },
      })

      monaco.editor.defineTheme("dark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.lineHighlightBorder": "#777777ff",
          "editor.lineHighlightBackground": "#77777717",
          "editorBracketMatch.border": "#ffffff00",
          "editorBracketMatch.background": "#ffffff22",
          "editorIndentGuide.background": "#00000000",
        },
      })

      monaco.languages.registerDocumentFormattingEditProvider(
        "javascript",
        prettierFormatter,
      )

      monaco.languages.registerDocumentFormattingEditProvider(
        "typescript",
        prettierFormatter,
      )

      return undefined
    },
  })

  React.useEffect(() => {
    if (!monaco) return
    monaco.editor.setTheme(theme)
  }, [monaco, theme])

  return { monaco, isLoading }
}
