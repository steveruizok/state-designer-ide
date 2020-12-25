import React from "react"
import NextDocument, {
  Html,
  Main,
  NextScript,
  DocumentContext,
} from "next/document"
import { setupUI } from "lib/local-data"

import { css, darkTheme } from "../components/theme"

export default class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage

    if (typeof document !== "undefined" && typeof window !== "undefined") {
      setupUI()
    }

    try {
      let extractedStyles: any
      ctx.renderPage = () => {
        const { styles, result } = css.getStyles(originalRenderPage)
        extractedStyles = styles
        return result
      }

      const initialProps = await NextDocument.getInitialProps(ctx)

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}

            {extractedStyles.map((content: any, index: number) => (
              <style
                key={index}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ))}
          </>
        ),
      }
    } finally {
    }
  }

  componentWillMount() {
    // For initial page load
  }

  render() {
    return (
      <Html lang="en">
        <body className={darkTheme}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
