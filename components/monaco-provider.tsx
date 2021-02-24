import * as React from "react"

import { MonacoProvider, plugins } from "use-monaco/dist/cjs/use-monaco"

import useTheme from "hooks/useTheme"

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
      languages={["javascript", "typescript"]}
      plugins={[
        plugins.prettier(["javascript", "typescript"], {
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
            noSemanticValidation: true,
            noSyntaxValidation: false,
          })

          monaco.languages.typescript // Types
            ?.loadTypes("react", "17.0.1")
          monaco.languages.typescript?.loadTypes(
            "@state-designer/react",
            "1.5.2",
          )
          monaco.languages.typescript?.loadTypes(
            "@state-designer/core",
            "1.5.2",
          )
          monaco.languages.typescript?.loadTypes("react-feather", "2.0.9")
          monaco.languages.typescript?.loadTypes("framer-motion", "3.1.1")

          monaco.languages.typescript?.exposeGlobal(
            `import { createState as _createState, DesignedState, useStateDesigner as _useStateDesigner } from '@state-designer/react';
             import React from 'react';
             import _getStatic from './static'
             import * as _Icons from 'react-feather';
             import { MotionProps, motion as _motion, CustomDomComponent as _CustomDomComponent } from 'framer-motion';
             `,
            `export const createState: typeof _createState;
             export const useStateDesigner: typeof _useStateDesigner;
             export const React: typeof React;
             export const Icons: typeof _Icons;

            type KeyboardHandler = (event: KeyboardEvent) => void
            type KeyHandlers = Record<string, KeyboardHandler>
            type KeyboardEventHandlers = Record<string, KeyHandlers>;
            type MouseEventHandler = (event: MouseEvent) => void;
            type MouseEventHandlers = Record<string, MouseEventHandler>;

            export const cloneDeep: typeof _cloneDeep

            export const Utils: {
              /**
              * Create an array containing n numbers, starting at zero.
              * @param {number} n The desired array length.
              * @example
              * range(4) // [0, 1, 2, 3]
              * range(5) // [0, 1, 2, 3, 4]
              */
             range: (n: number) => number[];
 
             /**
              * Create an array containing y number of rows with x number of entries per row.
              * @param {number} y The desired length of the outer array.
              * @param {number} x The desired array of each inner array.
              * @example
              * range2d(2, 2) // [[0, 1], [0, 1]]
              * range2d(2, 3) // [[0, 1], [0, 1], [0, 1]]
              */
             range2d: (y: number, x: number) => number[][];
 
             /**
              * Swap the values of an array at index a and b.
              * @param {any[]} arr The array to mutate.
              * @param {number} a The first index to swap.
              * @param {number} b The second index to swap.
              * @example
              * swap([0, 1, 2], 0, 2) // [2, 1, 0]
              * swap([0, 1, 2], 1, 2) // [0, 2, 1]
              */
             swap: <T>(arr: T[], a: number, b: number) => T[];
 
             /**
              * Randomly re-arrange the values of an array.
              * @param {any[]} arr The array to mutate.
              * @example
              * shuffle([0, 1, 2, 3]) // [2, 3, 1, 0]
              * shuffle([0, 1, 2, 3]) // [1, 0, 3, 2]
              */
             shuffle: <T>(arr: T[]) => T[];
 
             /**
              * Clamps a number (num) between the minimum and maximum values.
              * @param {*} num
              * @param {*} min
              * @param {*} max
              */
             clamp: (num: number, min: number, max: number) => number;
 
             /**
              * Add a delay into an asynchronous function.
              * @param {number} ms
              */
             delay: (ms?: number) => Promise<unknown>;
              /**
               * Interpolate a new between two other numbers.
               * @param {number} a The low end of the range, shown when t is 0.
               * @param {number} b The high end of the range, shown when t is 1.
               * @param {number} t How far to interpolate between the numbers.
               */
              lerp: (a: number, b: number, t: number) => number;
              /**
               * A hook for responding to key down and key up events.
               * @param {options} handlers An object containing callbacks for onKeyDown and onKeyUp.
               */
              useKeyboardInputs(handlers?: KeyboardEventHandlers): React.MutableRefObject<HTMLElement>;
              useMouseInput(handlers: MouseEventHandlers): React.MutableRefObject<HTMLElement>;
              cloneDeep: any
              sample: any
              get: any
              union: any
              debounce: any
              pull: any
              sortBy: any
              intersection: any
              without: any
              difference: any
              uniq: any
            }

             const _Colors = {
              Black: "#1a1c2c",
              Purple: "#5d275d",
              Red: "#b13e53",
              Orange: "#ef7d57",
              Yellow: "#ffcd75",
              LightGreen: "#a7f070",
              Green: "#38b764",
              DarkGreen: "#257179",
              DarkBlue: "#29366f",
              Blue: "#3b5dc9",
              LightBlue: "#41a6f6",
              Aqua: "#73eff7",
              White: "#f4f4f4",
              LightGray: "#94b0c2",
              Gray: "#566c86",
              DarkGray: "#333c57",
            };

            type TC<T> = React.FC<React.HTMLProps<T> & MotionProps & { css?: {[key: string]: any} }>

            export const Colors: typeof _Colors;
            export const css: any
            export const styled: any;
            export const Box: TC<HTMLDivElement>;
            export const Grid: TC<HTMLDivElement>;
            export const Flex: TC<HTMLDivElement>;
            export const Heading: TC<HTMLHeadingElement>;
            export const Checkbox: TC<HTMLInputElement>;
            export const Label: TC<HTMLLabelElement>;
            export const Input: TC<HTMLInputElement>;
            export const IconButton: TC<HTMLButtonElement>;
            export const Button: TC<HTMLButtonElement>;
            export const Text: TC<HTMLParagraphElement>;
            
            export const ColorMode: "dark" | "light";

            export const Static: ReturnType<typeof _getStatic>;
            
             /**
              * Log a message to the console.
              */
             export const log: (...messages: any[]) => void;
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
