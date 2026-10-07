import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { PRIORITIES, ROLES, STATUSES } from '../constants/options.js'
import { useAuth } from '../hooks/useAuth.js'
import { deleteRequest, getRequests } from '../services/requestService.js'
import { CategoryBadge, PriorityBadge, StatusBadge } from '../components/Badges.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { EmptyState, ErrorState, LoadingState } from '../components/PageState.jsx'
import { formatDate } from '../utils/formatDate.js'
import { getErrorMessage, isUnauthorized } from '../utils/getErrorMessage.js'
import { canEditRequest } from '../utils/requestPermissions.js'
import './RequestListPage.scss'

const STATUS_VALUES = STATUSES.map((item) => item.value)
const PRIORITY_VALUES = PRIORITIES.map((item) => item.value)

function readFilter(searchParams, key, allowed) {
    const value = searchParams.get(key) || ''
    return allowed.includes(value) ? value : ''
}

export default function RequestListPage() {
    const { user } = useAuth()
    const [searchParams, setSearchParams] = useSearchParams()
    const status = readFilter(searchParams, 'status', STATUS_VALUES)
    const priority = readFilter(searchParams, 'priority', PRIORITY_VALUES)
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [reloadKey, setReloadKey] = useState(0)
    const [pendingDelete, setPendingDelete] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const isAdmin = user?.role === ROLES.ADMIN
    const filtersActive = Boolean(status || priority)

    useEffect(() => {
        let active = true

        setLoading(true)
        setError('')

        getRequests({ status, priority })
            .then((rows) => {
                if (active) setRequests(rows)
            })
            .catch((requestError) => {
                if (active && !isUnauthorized(requestError)) {
                    setError(getErrorMessage(requestError, 'Could not load requests'))
                }
            })
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => {
            active = false
        }
    }, [status, priority, reloadKey])

    const updateFilter = (key, value) => {
        const next = new URLSearchParams(searchParams)
        if (value) next.set(key, value)
        else next.delete(key)
        setSearchParams(next)
    }

    const confirmDelete = async () => {
        if (!pendingDelete) return

        const requestId = pendingDelete.id
        setDeleting(true)

        try {
            const response = await deleteRequest(requestId)
            setRequests((current) => current.filter((item) => item.id !== requestId))
            setPendingDelete(null)
            toast.success(response.message || 'Request deleted')
        } catch (requestError) {
            if (!isUnauthorized(requestError)) {
                toast.error(getErrorMessage(requestError, 'Could not delete the request'))
            }
        } finally {
            setDeleting(false)
        }
    }

    return (
        <section className="panel">
            <header className="page-header">
                <div>
                    <p className="eyebrow">{isAdmin ? 'Admin' : 'My work'}</p>
                    <h1>{isAdmin ? 'All requests' : 'My requests'}</h1>
                    <p className="lede">
                        {isAdmin
                            ? 'Every service request in the system.'
                            : 'Requests you have submitted.'}
                    </p>
                </div>
                {!isAdmin && <Link className="button primary" to="/requests/new">New request</Link>}
            </header>

            <div className="filter-bar">
                <label>
                    Status
                    <select value={status} onChange={(event) => updateFilter('status', event.target.value)}>
                        <option value="">All</option>
                        {STATUSES.map((item) => (
                            <option key={item.value} value={item.value}>{item.label}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Priority
                    <select value={priority} onChange={(event) => updateFilter('priority', event.target.value)}>
                        <option value="">All</option>
                        {PRIORITIES.map((item) => (
                            <option key={item.value} value={item.value}>{item.label}</option>
                        ))}
                    </select>
                </label>
                {filtersActive && (
                    <button type="button" className="button ghost" onClick={() => setSearchParams({})}>
                        Clear filters
                    </button>
                )}
            </div>

            {loading && <LoadingState label="Loading requests..." />}
            {!loading && error && <ErrorState message={error} onRetry={() => setReloadKey((value) => value + 1)} />}

            {!loading && !error && requests.length === 0 && (
                <EmptyState
                    title={filtersActive ? 'No matching requests' : 'No requests yet'}
                    message={
                        filtersActive
                            ? 'Nothing matches the current status and priority filters.'
                            : isAdmin
                                ? 'No service requests have been submitted yet.'
                                : 'You have not submitted any requests yet.'
                    }
                    action={
                        filtersActive
                            ? <button type="button" className="button secondary" onClick={() => setSearchParams({})}>Clear filters</button>
                            : !isAdmin
                                ? <Link className="button primary" to="/requests/new">Create a request</Link>
                                : null
                    }
                />
            )}

            {!loading && !error && requests.length > 0 && (
                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((request) => (
                                <tr key={request.id}>
                                    <td data-label="Title" className="title-cell">{request.title}</td>
                                    <td data-label="Category"><CategoryBadge category={request.category} /></td>
                                    <td data-label="Priority"><PriorityBadge priority={request.priority} /></td>
                                    <td data-label="Status"><StatusBadge status={request.status} /></td>
                                    <td data-label="Created">{formatDate(request.created_at)}</td>
                                    <td data-label="Actions" className="actions">
                                        <Link className="button small" to={`/requests/${request.id}`}>View</Link>
                                        {canEditRequest(user, request) && (
                                            <Link className="button small secondary" to={`/requests/${request.id}/edit`}>Edit</Link>
                                        )}
                                        <button type="button" className="button small danger" onClick={() => setPendingDelete(request)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {pendingDelete && (
                <ConfirmDialog
                    title="Delete request"
                    message={`Delete "${pendingDelete.title}"? This cannot be undone.`}
                    busy={deleting}
                    onCancel={() => {
                        if (!deleting) setPendingDelete(null)
                    }}
                    onConfirm={confirmDelete}
                />
            )}
        </section>
    )
}
