import React, { Suspense } from 'react';

// Lazy load the TodoListContainer component
const TodoListContainer = React.lazy(() => import('@components/TodoListContainer'));

/**
 * ErrorBoundary component to catch errors in child components.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught in ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please try again later.</div>;
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <TodoListContainer />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
