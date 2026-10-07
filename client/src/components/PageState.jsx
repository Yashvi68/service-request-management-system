import './PageState.scss'

export function LoadingState({ label = 'Loading...' }) {
    return (
        <div className="state-panel" role="status">
            <span className="spinner" aria-hidden="true" />
            <p>{label}</p>
        </div>
    )
}

export function EmptyState({ title, message, action }) {
    return (
        <div className="state-panel">
            <h2>{title}</h2>
            <p>{message}</p>
            {action}
        </div>
    )
}

export function ErrorState({ message, onRetry }) {
    return (
        <div className="state-panel error" role="alert">
            <h2>Something went wrong</h2>
            <p>{message}</p>
            {onRetry && (
                <button type="button" className="button secondary" onClick={onRetry}>
                    Try again
                </button>
            )}
        </div>
    )
}
