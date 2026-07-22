import { Component } from 'react';
import { Box } from '@mui/material';
import ErrorDisplay from './ErrorDisplay';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.locationKey !== this.props.locationKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 2 }}>
          <ErrorDisplay
            message={this.state.error?.message || 'An unexpected error occurred'}
            onRetry={this.handleRetry}
            fullPage
          />
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
