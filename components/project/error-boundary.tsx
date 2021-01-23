import * as React from "react"

class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
    errorMessage: "",
  }

  constructor(props) {
    super(props)
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message }
  }

  componentDidCatch(error, errorInfo) {
    console.log("Encountered an error", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <div>Error {this.state.errorMessage}</div>
    }
    return this.props.children
  }
}

export default ErrorBoundary
