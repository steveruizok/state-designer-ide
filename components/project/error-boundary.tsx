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

  componentDidCatch(error, errorInfo) {}

  render() {
    return this.props.children
  }
}

export default ErrorBoundary
