import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardSummary } from '../services/dashboardService.js'
import { ErrorState, LoadingState } from '../components/PageState.jsx'
import { getErrorMessage, isUnauthorized } from '../utils/getErrorMessage.js'
import './DashboardPage.scss'

const CARDS = [
    { key: 'total', label: 'Total requests', to: '/requests', hint: 'Every request' },
    { key: 'open', label: 'Open', to: '/requests?status=OPEN', hint: 'Waiting to start' },
    { key: 'inProgress', label: 'In progress', to: '/requests?status=IN_PROGRESS', hint: 'Currently being handled' },
    { key: 'resolved', label: 'Resolved', to: '/requests?status=RESOLVED', hint: 'Finished' },
    { key: 'highPriority', label: 'High priority', to: '/requests?priority=HIGH', hint: 'Needs attention', tone: 'high' },
]

export default function DashboardPage() {
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [reloadKey, setReloadKey] = useState(0)

    useEffect(() => {
        let active = true

        setLoading(true)
        setError('')

        getDashboardSummary()
            .then((data) => {
                if (active) setSummary(data)
            })
            .catch((requestError) => {
                if (active && !isUnauthorized(requestError)) {
                    setError(getErrorMessage(requestError, 'Could not load dashboard statistics'))
                }
            })
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => {
            active = false
        }
    }, [reloadKey])

    return (
        <section className="panel">
            <header className="page-header">
                <div>
                    <p className="eyebrow">Admin</p>
                    <h1>Dashboard</h1>
                    <p className="lede">Counts are calculated from the service request database.</p>
                </div>
            </header>

            {loading && <LoadingState label="Loading statistics..." />}
            {!loading && error && <ErrorState message={error} onRetry={() => setReloadKey((value) => value + 1)} />}

            {!loading && !error && summary && (
                <>
                    <div className="stat-grid">
                        {CARDS.map((card) => (
                            <Link key={card.key} to={card.to} className={`stat-card ${card.tone || ''}`}>
                                <span className="stat-label">{card.label}</span>
                                <span className="stat-value">{summary[card.key] ?? 0}</span>
                                <span className="stat-hint">{card.hint}</span>
                            </Link>
                        ))}
                    </div>
                    {summary.total === 0 && (
                        <p className="hint">There are no service requests yet. Totals stay at zero until one is created.</p>
                    )}
                </>
            )}
        </section>
    )
}
