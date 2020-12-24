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
      monaco.editor.defineTheme("light", {
        base: "vs",
        inherit: true,
        rules: [],
        colors: {
          "editorCursor.foreground": "red",
          "editorBracketMatch.border": "#ffffff00",
          "editorBracketMatch.background": "#ffffff33",
          "editorIndentGuide.background": "#ffffff00",
        },
      })

      monaco.editor.defineTheme("dark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editorCursor.foreground": "red",
          "editorBracketMatch.border": "#ffffff00",
          "editorBracketMatch.background": "#ffffff33",
          "editorIndentGuide.background": "#ffffff00",
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

  return { monaco, isLoading }
}
