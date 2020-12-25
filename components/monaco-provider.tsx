import * as React from "react"
import { MonacoProvider } from "use-monaco"
import useTheme from "hooks/useTheme"
import prettier from "prettier/standalone"
import parser from "prettier/parser-typescript"
import STATE_DESIGNER from "node_modules/@state-designer/react/dist/index"

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

export default function CustomMonacoProvider({ children }) {
  const rMonaco = React.useRef<any>()
  const { theme } = useTheme()

  React.useEffect(() => {
    rMonaco.current?.editor.setTheme(theme)
  }, [theme])

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
          rMonaco.current = monaco

          // Compiler Options
          const compilerOptions = {
            allowJs: true,
            checkJs: true,
            esModuleInterop: true,
            allowNonTsExtensions: true,
            allowSyntheticDefaultImports: true,
            alwaysStrict: true,
            noEmit: true,
            noLib: true,
            moduleResolution: 2,
            module: 1,
            target: 99,
            lib: ["es5", "es6", "dom", "dom.iterable"],
            jsx: 2,
            reactNamespace: "React",
            jsxFactory: "React.createElement",
          }

          monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: true,
          })

          monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: false,
            noSyntaxValidation: false,
          })

          monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
            compilerOptions,
          )
          monaco.languages.typescript.javascriptDefaults.setCompilerOptions(
            compilerOptions,
          )

          // Model sync
          monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)
          monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true)

          // Prettier

          monaco.languages.registerDocumentFormattingEditProvider(
            "typescript",
            prettierFormatter,
          )

          monaco.languages.registerDocumentFormattingEditProvider(
            "javascript",
            prettierFormatter,
          )

          // Types

          monaco.languages.typescript?.loadTypes("react", "17.0.1")
          // monaco.languages.typescript?.exposeGlobal("react", "*", "React")

          // monaco.languages.typescript?.loadTypes(
          //   "@state-designer/react",
          //   "1.3.35",
          // )

          // monaco.languages.typescript?.exposeGlobal(
          //   "@state-designer/react",
          //   "createState",
          //   "createState",
          // )

          // monaco.languages.typescript?.exposeGlobal(
          //   "@state-designer/react",
          //   "useStateDesigner",
          //   "useStateDesigner",
          // )

          return null
        }
      }}
    >
      {children}
    </MonacoProvider>
  )
}
