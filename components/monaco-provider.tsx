import { MonacoProvider } from "use-monaco"
import useTheme from "hooks/useTheme"

const themes = {
  light: {
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
  },
  dark: {
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
  },
}

export function CustomMonacoProvider({ children }) {
  const { theme } = useTheme()
  return (
    <MonacoProvider
      theme={theme}
      plugins={{
        theme: {
          themes: themes,
        },
        typings: true,
        prettier: ["javascript", "typescript", "json"],
      }}
      onLoad={(monaco) => {
        if (monaco) {
          monaco.languages.typescript?.loadTypes("state-designer", "1.3.35")
          monaco.languages.typescript?.exposeGlobal(
            "state-designer",
            "useStateDesigner",
            "useStateDesigner",
          )
          return null
        }
      }}
    >
      {children}
    </MonacoProvider>
  )
}
