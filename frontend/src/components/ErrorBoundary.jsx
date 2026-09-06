import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
                    <div className="card bg-base-100 shadow-xl max-w-lg w-full">
                        <div className="card-body items-center text-center">
                            <div className="size-16 bg-error/10 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="size-8 text-error" />
                            </div>
                            <h2 className="card-title text-2xl mb-2">Something went wrong!</h2>
                            <p className="text-base-content/70 mb-6">
                                We apologize for the inconvenience. An unexpected error has occurred.
                            </p>

                            <div className="collapse collapse-arrow border border-base-300 bg-base-200 rounded-box mb-6 text-left">
                                <input type="checkbox" />
                                <div className="collapse-title text-sm font-medium">
                                    Error Details
                                </div>
                                <div className="collapse-content">
                                    <pre className="text-xs overflow-auto max-h-40 p-2 bg-base-300 rounded">
                                        {this.state.error && this.state.error.toString()}
                                        <br />
                                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                                    </pre>
                                </div>
                            </div>

                            <div className="card-actions">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => window.location.reload()}
                                >
                                    Reload Page
                                </button>
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => window.location.href = '/'}
                                >
                                    Go Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
