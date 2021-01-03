import { ProjectData } from "types"
import { getParameters } from "codesandbox/lib/api/define"

export default async function getCodeSandboxUrl(project: ProjectData) {
  const packageCode = `
{
	"name": ${project.name},
	"version": "1.0.0",
	"private": true,
	"description": "React example starter project",
	"keywords": ["react", "starter"],
	"main": "src/index.js",
	"dependencies": {
		"react": "17.0.0",
		"react-dom": "17.0.0",
		"react-scripts": "3.4.3",
		"@state-designer/react": "latest",
		"@stitches/react": "latest",
		"@radix-ui/react-checkbox": "latest",
		"react-feather": "latest",
		"lodash": "latest"
	},
	"devDependencies": {
		"typescript": "3.8.3"
	},
	"scripts": {
		"start": "react-scripts start",
		"build": "react-scripts build",
		"test": "react-scripts test --env=jsdom",
		"eject": "react-scripts eject"
	},
	"browserslist": [">0.2%", "not dead", "not ie <= 11", "not op_mini all"]
}`

  const indexCode = `
import React from "react"
import ReactDOM from "react-dom"
import { darkTheme } from "./stitches.config"

import App from "./app"

const rootElement = document.getElementById("root")

document.body.className = darkTheme

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	rootElement
)
	
`

  const indexHtmlCode = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<meta name="theme-color" content="#000000">
	<link rel="manifest" href="%PUBLIC_URL%/manifest.json">
	<link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
	<title>${project.name} - State Designer</title>
</head>
<body>
	<noscript>
		You need to enable JavaScript to run this app.
	</noscript>
	<div id="root"></div>
</body>
</html>
`

  const appCode = `
import React from "react"
import { motion, useMotionValue, motionValue, useTransform, transform, AnimatePresence, AnimateSharedLayout } from "framer-motion"
import { Colors, Utils } from "./resources"
import { useStateDesigner } from "@state-designer/react"
import { styled, css } from "./stitches.config.js"
import { Static } from "./static.js"
import {
	Box,
	Button,
	Checkbox,
	Container,
	Divider,
	Flex,
	Grid,
	Heading,
	Input,
	Label,
	PlainButton,
	PlainIconButton,
	Text,
	View
} from "./styled"

const rLiveView = React.createRef()

function usePointer(ref = rLiveView, onMove = () => {}) {
  const mvX = useMotionValue(0)
  const mvY = useMotionValue(0)
  const mvDX = useMotionValue(0)
  const mvDY = useMotionValue(0)

  const rOffset = React.useRef({
    left: 0,
    top: 0,
  })
  
  React.useEffect(() => {
    function updateBoundingBox() {
      const { left, top } = ref.current.getBoundingClientRect()
      rOffset.current = { left, top }
    }

    let timeout = setInterval(updateBoundingBox, 1000)
    return () => clearInterval(timeout)
  }, [])

  React.useEffect(() => {
    function updateMotionValues(e) {
      const { left, top } = rOffset.current
      const x = e.pageX - left, y = e.pageY - top

      mvDX.set(x - mvX.get())
      mvDY.set(y - mvY.get())
      mvX.set(x)
      mvY.set(y)

      if (onMove) {
        onMove({
          dx: mvDX.get(),
          dy: mvDY.get(),
          x: mvX.get(),
          y: mvY.get(),
        })
      }
    }

    window.addEventListener("pointermove", updateMotionValues)
    return () => window.removeEventListener("pointermove", updateMotionValues)
  }, [])

  return { x: mvX, y: mvY, dx: mvDX, dy: mvDY }
}

function useKeyboardInputs(
  handlers = {},
) {
  React.useEffect(() => {
    const { onKeyDown = {}, onKeyUp = {} } = handlers


    function handleKeydown(event) {
      if (!onKeyDown) return
      if (onKeyDown[event.key] !== undefined) {
        event.preventDefault()
        onKeyDown[event.key](event)
      }
    }

    function handleKeyup(event) {
      if (!onKeyUp) return
      if (onKeyUp[event.key] !== undefined) {
        event.preventDefault()
        onKeyUp[event.key](event)
      }
    }

    window.addEventListener("keydown", handleKeydown)
    window.addEventListener("keyup", handleKeyup)

    return () => {
      window.removeEventListener("keydown", handleKeydown)
      window.removeEventListener("keyup", handleKeyup)
    }
  }, [])
}

${project.code.view}
`

  const staticCode = `
import { Colors, Utils } from "./resources"

${project.code.static}

export const Static = getStatic()
`

  const resourcesCode = `
import {
  cloneDeep,
  debounce,
  difference,
  get,
  intersection,
  pull,
  sample,
  sortBy,
  union,
  uniq,
  without
} from "lodash"
import * as React from "react"

export function range(n) {
  return [...Array(n)].map((_, i) => i)
}

export function range2d(y, x) {
  return range(y).map(() => range(x).map((i) => i))
}

export function swap(arr, a, b) {
  ;[arr[a], arr[b]] = [arr[b], arr[a]]
  return arr
}

export function shuffle(arr) {
  let a = arr.length

  while (a) {
    const b = Math.floor(Math.random() * a--)
    swap(arr, a, b)
  }

  return arr
}

export function clamp(num, min, max) {
  return Math.max(Math.min(num, Math.max(min, max)), Math.min(min, max))
}

export async function delay(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function lerp(a, b, t) {
  return a * (1 - t) + b * t
}

export function useKeyboardInputs(handlers = { onKeyDown: {}, onKeyUp: {} }) {
  const ref = React.useRef()

  React.useEffect(() => {
		const element = ref.current
    if (!element) return
    const { onKeyDown, onKeyUp } = handlers
    function handleKeydown(event) {
      if (onKeyDown?.[event.key] !== undefined) {
        event.preventDefault()
        onKeyDown[event.key](event)
      }
    }

    function handleKeyup(event) {
      if (onKeyUp?.[event.key] !== undefined) {
        event.preventDefault()
        onKeyUp[event.key](event)
      }
    }

    element.addEventListener("keydown", handleKeydown)
    element.addEventListener("keyup", handleKeyup)

    return () => {
      element.removeEventListener("keydown", handleKeydown)
      element.removeEventListener("keyup", handleKeyup)
    }
  }, [ref])

  return ref
}

export function useMouseInput(handlers) {
  const ref = React.useRef()

  React.useEffect(() => {
		const element = ref.current
    if (!element) return

    const { onMouseUp, onMouseDown, onMouseMove } = handlers
    function handleMouseUp(event) {
      onMouseUp && onMouseUp(event)
    }

    function handleMouseDown(event) {
      onMouseDown && onMouseDown(event)
    }

    function handleMouseMove(event) {
      onMouseMove && onMouseMove(event)
    }

    element.addEventListener("mousedown", handleMouseDown)
    element.addEventListener("mouseup", handleMouseUp)
    element.addEventListener("mousemove", handleMouseMove)

    return () => {
      element.removeEventListener("mousedown", handleMouseDown)
      element.removeEventListener("mouseup", handleMouseUp)
      element.removeEventListener("mousemove", handleMouseMove)
    }
  }, [ref])

  return ref
}

export {
  cloneDeep,
  sample,
  get,
  union,
  debounce,
  pull,
  sortBy,
  intersection,
  without,
  difference,
  uniq
}

export const Colors = {
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
}
`

  const stitchesConfigCode = `
import { createStyled } from "@stitches/react"

export const { styled, css } = createStyled({
  tokens: {
    colors: {
      $text: "#000",
      $muted: "#fafafa",
      $background: "#ffffff",
      $codeText: "#f8f8f2",
      $codeBg: "#ffffff",
      $codeHl: "#f3f3f3",
      $accent: "#ff0000",
      $accentInactive: "rgba(255, 0, 0, .5)",
      $canvas: "#eeeeee",
      $border: "#eeeeee",
      $borderContrast: "#ddd",
      $shadowLight: "rgba(144, 144, 144, .1)",
      $shadow: "rgba(144, 144, 144, .3)",
      $toastBg: "#ffffff",
      $active: "#000",
      $inactive: "#bbb",
      $root: "rgba(255, 255, 255, .5)",
      $node: "rgba(255, 255, 255, .5)",
      $scrim: "rgb(238, 238, 238, .9)",
      $message: "#294de2",
      $Black: "#1a1c2c",
      $Purple: "#5d275d",
      $Red: "#b13e53",
      $Orange: "#ef7d57",
      $Yellow: "#ffcd75",
      $LightGreen: "#a7f070",
      $Green: "#38b764",
      $DarkGreen: "#257179",
      $DarkBlue: "#29366f",
      $Blue: "#3b5dc9",
      $LightBlue: "#41a6f6",
      $Aqua: "#73eff7",
      $White: "#f4f4f4",
      $LightGray: "#94b0c2",
      $Gray: "#566c86",
      $DarkGray: "#333c57",
    },
    lineHeights: {
      $ui: "1",
      $header: "1.2",
      $body: "1.5",
    },
    space: {
      $0: "4px",
      $1: "8px",
      $2: "16px",
      $3: "24px",
      $4: "32px",
      $5: "40px",
      $6: "48px",
      $7: "64px",
      $8: "80px",
      $9: "96px",
      $10: "128px",
    },
    fontSizes: {
      $0: "12px",
      $1: "14px",
      $2: "16px",
      $3: "18px",
      $4: "20px",
      $5: "24px",
      $6: "32px",
      $code: "16px",
    },
    fontWeights: {
      $0: "light",
      $1: "normal",
      $2: "bold",
    },
    radii: {
      $0: "2px",
      $1: "4px",
      $2: "8px",
      $3: "16px",
      $4: "20px",
    },
    fonts: {
      $body: "'Fira Sans', system-ui, sans-serif",
      $ui: "'Fira Sans', system-ui, sans-serif",
      $heading: "'Fira Sans', system-ui, sans-serif",
      $display: "'Fira Sans', system-ui, sans-serif",
      $monospace: "'Fira Code', monospace",
    },
  },
  breakpoints: {},

  utils: {
    m: () => (value: number | string) => ({
      marginTop: value,
      marginBottom: value,
      marginLeft: value,
      marginRight: value,
    }),
    mt: () => (value: number | string) => ({
      marginTop: value,
    }),
    mr: () => (value: number | string) => ({
      marginRight: value,
    }),
    mb: () => (value: number | string) => ({
      marginBottom: value,
    }),
    ml: () => (value: number | string) => ({
      marginLeft: value,
    }),
    mx: () => (value: number | string) => ({
      marginLeft: value,
      marginRight: value,
    }),
    my: () => (value: number | string) => ({
      marginTop: value,
      marginBottom: value,
    }),
    p: () => (value: number | string) => ({
      paddingTop: value,
      paddingBottom: value,
      paddingLeft: value,
      paddingRight: value,
      padding: value,
    }),
    pt: () => (value: number | string) => ({
      paddingTop: value,
    }),
    pr: () => (value: number | string) => ({
      paddingRight: value,
    }),
    pb: () => (value: number | string) => ({
      paddingBottom: value,
    }),
    pl: () => (value: number | string) => ({
      paddingLeft: value,
    }),
    px: () => (value: number | string) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: () => (value: number | string) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
    size: () => (value: number | string) => ({
      width: value,
      height: value,
    }),
    bg: () => (value: string) => ({
      backgroundColor: value,
    }),
    br: () => (value: string) => ({
      borderRadius: value,
    }),
    fadeBg: () => (value: number) => ({
      transition: \`background-color \${value}s\`,
    }),
  },
})

export const lightTheme = css.theme({})

export const darkTheme = css.theme({
  colors: {
    $text: "#fcfcfa",
    $muted: "#242529",
    $background: "#202124",
    $codeText: "#f8f8f2",
    $codeBg: "#1e1e1e",
    $codeHl: "#3b3d41",
    $canvas: "#1b1c1e",
    $border: "#19181a",
    $borderContrast: "#222",
    $active: "#fcfcfa",
    $inactive: "rgba(245, 240, 244, .2)", //"#75757a",
    $root: "rgba(245, 240, 255, .04)",
    $node: "rgba(245, 240, 255, .02)",
    $scrim: "rgb(25, 24, 26, .9)",
    $toastBg: "#1e1e1e",
    $shadowLight: "rgba(0,0,0, .1)",
    $shadow: "rgba(0,0,0, .3)",
  },
})

css.global({
  "*": {
    boxSizing: "border-box",
    "&::-webkit-scrollbar": {
      width: "0",
    },
    p: 0,
    m: 0,
  },
  html: {
    overscrollBehavior: "none",
  },
  body: {
		p: "$2",
    fontFamily: "$body",
    fontWeight: "$2",
    color: "$text",
    bg: "$background",
    overscrollBehavior: "none",
  },
  a: { color: "$text" },
  "h1,h2,h3,h4,h5,h6": { color: "$text", m: 0, p: 0 },
  p: { color: "$text" },
})
`

  const styledCode = `
import * as React from "react"
import * as rCheckbox from "@radix-ui/react-checkbox"
import { motion } from "framer-motion"

import { styled } from "./stitches.config"

import { Check } from "react-feather"

const _Container = styled.div({
	display: "grid",
	p: "$3",
	gap: "$2",
	bg: "$root",
	borderRadius: "$2"
})

const _Box = styled.div({})

const _Grid = styled.div({
	display: "grid",
	variants: {
		gaps: {
			none: {
				gap: 0
			},
			tight: {
				gap: "$0"
			},
			thin: {
				gap: "$1"
			},
			normal: {
				gap: "$2"
			},
			cozy: {
				gap: "$3"
			}
		}
	}
})

const _Flex = styled.div({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	gap: "$1",
	variants: {
		gaps: {
			none: {
				gap: 0
			},
			tight: {
				gap: "$0"
			},
			thin: {
				gap: "$1"
			},
			normal: {
				gap: "$2"
			},
			cozy: {
				gap: "$3"
			}
		}
	}
})

const _Heading = styled.h2({
	variants: {
		highlight: {
			true: { color: "$accent" }
		},
		center: {
			true: { textAlign: "center" }
		},
		monospace: {
			true: { fontFamily: "$monospace" }
		}
	}
})

const _Text = styled.p({
	m: 0,
	p: 0,
	fontSize: "$2",
	fontWeight: "bold",
	lineHeight: "$body",
	color: "$text",
	variants: {
		highlight: {
			true: { color: "$accent" }
		},
		center: {
			true: { textAlign: "center" }
		},
		monospace: {
			true: { fontFamily: "$monospace" }
		},
		variant: {
			body: {
				fontSize: "$2",
				fontWeight: "normal",
				lineHeight: "$body"
			},
			ui: {
				fontSize: "$1",
				lineHeight: "$ui",
				m: 0,
				p: 0
			},
			detail: {
				fontSize: "$1",
				lineHeight: "$ui",
				color: "$inactive",
				fontWeight: "normal"
			}
		}
	}
})

const _View = styled.div({
	position: "relative",
	height: "100%",
	width: "100%",
	display: "flex",
	overflow: "hidden",
	alignItems: "center",
	justifyContent: "center"
})

const _Input = styled.input({
	fontFamily: "$body",
	fontSize: "$2",
	color: "$text",
	bg: "$muted",
	px: "$2",
	py: "$1",
	border: "none",
	borderRadius: "$1",
	outline: "none",
	"&:focus": {
		bg: "$hover"
	},
	"&:disabled": {
		opacity: 0.5
	}
})

const _StyledCheckbox = styled(rCheckbox.Root, {
	appearance: "none",
	cursor: "pointer",
	backgroundColor: "transparent",
	border: "none",
	padding: 0,
	boxShadow: "inset 0 0 0 2px $text",
	width: 15,
	height: 15,
	borderRadius: 2,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	outline: "none",
	color: "$text",
	"& svg": {
		mt: "2px",
		height: 11,
		width: 11
	},
	"&:disabled": {
		opacity: 0.5
	},
	"&:hover": {
		color: "$accent",
		boxShadow: "inset 0 0 0 2px $accent"
	}
})

const _Checkbox = React.forwardRef((props, ref) => (
	<_StyledCheckbox
		defaultChecked
		{...props}
		onCheckedChange={props.onChange}
		ref={ref}
	>
		<rCheckbox.Indicator>
			<Check strokeWidth={4} />
		</rCheckbox.Indicator>
	</_StyledCheckbox>
))

const _Label = styled.label({
	fontSize: "_$1"
})

const _Button = styled.button({
	cursor: "pointer",
	fontWeight: "bold",
	fontFamily: "$body",
	fontSize: "$2",
	lineHeight: "$ui",
	width: "100%",
	px: "$3",
	py: "$2",
	alignItems: "center",
	textAlign: "center",
	display: "grid",
	gridAutoFlow: "column",
	gap: "$0",
	outline: "none",
	bg: "$muted",
	border: "none",
	borderRadius: "$1",
	color: "$text",
	"&:hover": {
		color: "$accent",
		bg: "$hover"
	},
	"&:disabled": {
		opacity: 0.5
	},
	variants: {
		highlight: {
			true: {
				color: "$accent"
			}
		},
		variant: {
			ghost: {
				bg: "$transparent",
				color: "$text"
			}
		},
		display: {
			tight: {
				display: "block",
				width: "100%",
				flexGrow: 2
			}
		}
	}
})

const _IconButton = styled.button({
	color: "$text",
	bg: "$muted",
	borderRadius: "$1",
	fontFamily: "$body",
	fontSize: "$2",
	fontWeight: "bold",
	border: "none",
	outline: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	"&:disabled": {
		opacity: 0.5
	},
	"& > p": {
		pr: "$1"
	},
	"&:hover": {
		color: "$accent",
		bg: "$hover"
	},
	p: "$1",
	cursor: "pointer",
	svg: {
		height: 18,
		width: 18
	}
})

const _Divider = styled.hr({
	borderColor: "$inactive",
	borderBottom: 0
})

const _Select = styled.select({
	cursor: "pointer",
	bg: "transparent",
	border: "none",
	color: "$text",
	px: "$0",
	outline: "none",
	fontSize: "$1",
	fontFamily: "$body",
	fontWeight: "bold",
	"&:hover": {
		color: "$accent"
	}
})

const components = {
	Box: _Box,
	Button: _Button,
	Checkbox: _Checkbox,
	Container: _Container,
	Divider: _Divider,
	Flex: _Flex,
	Grid: _Grid,
	Heading: _Heading,
	Input: _Input,
	Label: _Label,
	IconButton: _IconButton,
	Text: _Text,
	View: _View,
	Select: _Select
}

const {
	Box,
	Button,
	Checkbox,
	Container,
	Divider,
	Flex,
	Grid,
	Heading,
	Input,
	Label,
	PlainButton,
	PlainIconButton,
	Text,
	View,
	Select
} = Object.fromEntries(
	Object.entries(components).map(([k, v]) => {
		return [k, motion.custom(v)]
	})
)

export {
	Box,
	Button,
	Checkbox,
	Container,
	Divider,
	Flex,
	Grid,
	Heading,
	Input,
	Label,
	PlainButton,
	PlainIconButton,
	Text,
	View
}
	
`

  const stateCode = `
import { createState } from "@state-designer/react"

${project.code.state}
`

  const data = await fetch(
    "https://codesandbox.io/api/v1/sandboxes/define?json=1",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        files: {
          "package.json": {
            content: {
              dependencies: {
                react: "17.0.0",
                "react-dom": "17.0.0",
                "react-scripts": "3.4.3",
                "@state-designer/react": "latest",
                "@stitches/react": "latest",
                "@radix-ui/react-checkbox": "latest",
                "framer-motion": "latest",
                "react-feather": "latest",
                lodash: "latest",
              },
            },
          },
          "index.js": {
            content: indexCode,
          },
          "stitches.config.js": {
            content: stitchesConfigCode,
          },
          "app.js": {
            content: appCode,
          },
          "static.js": {
            content: staticCode,
          },
          "styled.js": {
            content: styledCode,
          },
          "state.js": {
            content: stateCode,
          },
          "resources.js": {
            content: resourcesCode,
          },
          "public/index.html": {
            content: indexHtmlCode,
          },
        },
        // files: {
        //   "package.json": {
        //     isBinary: false,
        //     content: packageCode,
        //   },
        //   "index.js": {
        //     isBinary: false,
        //     content: indexCode,
        //   },
        //   "stitches.config.js": {
        //     isBinary: false,
        //     content: stitchesConfigCode,
        //   },
        //   "app.js": {
        //     isBinary: false,
        //     content: staticCode,
        //   },
        //   "static.js": {
        //     isBinary: false,
        //     content: staticCode,
        //   },
        //   "styled.js": {
        //     isBinary: false,
        //     content: styledCode,
        //   },
        //   "state.js": {
        //     isBinary: false,
        //     content: stateCode,
        //   },
        //   "public/index.html": {
        //     isBinary: false,
        //     content: indexHtmlCode,
        //   },
        // },
      }),
    },
  )
    .then((x) => x.json())
    .catch((e) => console.log(e))

  console.log(data)

  return `https://codesandbox.io/s/${data.sandbox_id}`
}
