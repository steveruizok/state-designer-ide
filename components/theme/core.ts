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
    fadeBg: () => (value: number) => ({
      transition: `background-color ${value}s`,
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
  },
  html: {
    overscrollBehavior: "none",
  },
  body: {
    fontFamily: "$body",
    fontWeight: "$2",
    color: "$text",
    bg: "$background",
    overscrollBehavior: "none",
  },
  a: {},
  h1: {},
  h2: {},
  h3: {},
  h4: {},
  h5: {},
  h6: {},
  p: {},
})
