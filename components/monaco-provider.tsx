import useTheme from "hooks/useTheme"
import {
  MonacoProvider,
  plugins,
} from "node_modules/use-monaco/dist/cjs/use-monaco"
import * as React from "react"

const themes = {
  light: {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#ffffff",
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
      themes={themes}
      theme={theme}
      plugins={[
        plugins.prettier(["javascript", "typescript", "json"], {
          semi: false,
          singleQuote: false,
          trailingComma: "es5",
          tabWidth: 2,
        }),
        plugins.typings({
          allowJs: true,
          checkJs: true,
          esModuleInterop: true,
          allowNonTsExtensions: true,
          allowSyntheticDefaultImports: true,
          strict: true,
          noEmit: true,
          noLib: false,
          moduleResolution: 2,
          module: 1,
          target: 1,
          jsx: 2,
          skipLibCheck: true,
          lib: ["dom", "dom.iterable", "esnext", "es2015"],
          reactNamespace: "React",
          jsxFactory: "React.createElement",
        }),
      ]}
      onLoad={(monaco) => {
        if (monaco) {
          rMonaco.current = monaco

          // Model sync
          monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)
          monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true)

          // Types

          monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: false,
            noSyntaxValidation: false,
          })

          monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: false,
            noSyntaxValidation: false,
          })

          // Types
          monaco.languages.typescript?.loadTypes("react", "17.0.1")
          monaco.languages.typescript?.loadTypes(
            "@state-designer/react",
            "1.3.35",
          )
          monaco.languages.typescript?.loadTypes(
            "@state-designer/core",
            "1.3.35",
          )
          monaco.languages.typescript?.loadTypes("state-designer", "1.3.35")

          monaco.languages.typescript?.exposeGlobal(
            `import { createState as _createState, DesignedState, useStateDesigner as _useStateDesigner } from 'state-designer';
             import React from 'react';`,

            `export const createState: typeof _createState;
             export const useStateDesigner: typeof _useStateDesigner;
             export const React: typeof React;

             /**
              * Log a message to the console.
              */
             export const log: (...messages: string[]) => void;
          `,
          )

          return null
        }
      }}
    >
      {children}
    </MonacoProvider>
  )
}
