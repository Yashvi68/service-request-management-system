import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { labelFor, ROLES, STATUSES, STATUS_LABELS } from '../constants/options.js'
import { useAuth } from '../hooks/useAuth.js'
import { deleteRequest, getRequest, updateRequestStatus } from '../services/requestService.js'
import { CategoryBadge, PriorityBadge, StatusBadge } from '../components/Badges.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import FormField from '../components/FormField.jsx'
import { ErrorState, LoadingState } from '../components/PageState.jsx'
import { formatDate } from '../utils/formatDate.js'
import { getErrorMessage, isUnauthorized } from '../utils/getErrorMessage.js'
import { canEditRequest, canDeleteRequest } from '../utils/requestPermissions.js'
import './RequestDetailsPage.scss'

function StatusForm({ request, onUpdated }) {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: 'onTouched',
        defaultValues: { status: request.status },
    })

    useEffect(() => {
        reset({ status: request.status })
    }, [request.status, reset])

    const selectedStatus = watch('status')

    const onSubmit = async (values) => {
        try {
            const response = await updateRequestStatus(request.id, values.status)
            onUpdated(response.data)
            toast.success(response.message || 'Status updated')
        } catch (error) {
            if (!isUnauthorized(error)) {
                toast.error(getErrorMessage(error, 'Could not update the status'))
            }
        }
    }

    return (
        <form className="status-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2>Change status</h2>
            <FormField id="status" label="Status" error={errors.status?.message}>
                <select
                    id="status"
                    aria-invalid={errors.status ? 'true' : undefined}
                    aria-describedby={errors.status ? 'status-error' : undefined}
                    {...register('status', { required: 'Status is required' })}
                >
                    {STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                </select>
            </FormField>
            <button
                type="submit"
                className="button primary"
                disabled={isSubmitting || selectedStatus === request.status}
            >
                {isSubmitting ? 'Updating...' : 'Update status'}
            </button>
        </form>
    )
}

export default function RequestDetailsPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [request, setRequest] = useState(null)
    const [loading, setLoading] = useState(true)
    const [pageError, setPageError] = useState(null)
    const [reloadKey, setReloadKey] = useState(0)
    const [confirmingDelete, setConfirmingDelete] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const isAdmin = user?.role === ROLES.ADMIN

    useEffect(() => {
        let active = true

        setLoading(true)
        setPageError(null)

        getRequest(id)
            .then((data) => {
                if (active) setRequest(data)
            })
            .catch((error) => {
                if (!active || isUnauthorized(error)) return
                const status = error?.response?.status
                setPageError({
                    message: getErrorMessage(error, 'Could not load this request'),
                    retry: status !== 403 && status !== 404,
                })
            })
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => {
            active = false
        }
    }, [id, reloadKey])

    const confirmDelete = async () => {
        setDeleting(true)

        try {
            const response = await deleteRequest(id)
            toast.success(response.message || 'Request deleted')
            navigate('/requests', { replace: true })
        } catch (error) {
            if (!isUnauthorized(error)) {
                toast.error(getErrorMessage(error, 'Could not delete the request'))
            }
            setDeleting(false)
        }
    }

    return (
        <section className="panel">
            <Link className="back-link" to="/requests">Back to requests</Link>

            {loading && <LoadingState label="Loading request..." />}
            {!loading && pageError && (
                <ErrorState
                    message={pageError.message}
                    onRetry={pageError.retry ? () => setReloadKey((value) => value + 1) : undefined}
                />
            )}

            {!loading && !pageError && request && (
                <>
                    <header className="page-header">
                        <div>
                            <h1>{request.title}</h1>
                            <div className="badge-row">
                                <CategoryBadge category={request.category} />
                                <PriorityBadge priority={request.priority} />
                                <StatusBadge status={request.status} />
                            </div>
                        </div>
                        {(canEditRequest(user, request) || canDeleteRequest(user, request)) && (
                            <div className="button-row">
                                {canEditRequest(user, request) && (
                                    <Link className="button secondary" to={`/requests/${request.id}/edit`}>Edit</Link>
                                )}
                                {canDeleteRequest(user, request) && (
                                    <button type="button" className="button danger" onClick={() => setConfirmingDelete(true)}>
                                        Delete
                                    </button>
                                )}
                            </div>
                        )}
                    </header>

                    <div className="detail-layout">
                        <article className="detail-card">
                            <h2>Description</h2>
                            <p className="description">{request.description}</p>
                        </article>

                        <aside className="detail-card">
                            <h2>Details</h2>
                            <dl className="meta-list">
                                <div>
                                    <dt>Requester</dt>
                                    <dd>{request.user_id === user?.id ? 'You' : (request.requester_name || `User #${request.user_id}`)}</dd>
                                </div>
                                <div>
                                    <dt>Status</dt>
                                    <dd>{labelFor(STATUS_LABELS, request.status)}</dd>
                                </div>
                                <div>
                                    <dt>Created</dt>
                                    <dd>{formatDate(request.created_at)}</dd>
                                </div>
                                <div>
                                    <dt>Updated</dt>
                                    <dd>{formatDate(request.updated_at)}</dd>
                                </div>
                            </dl>
                            {isAdmin && request.status !== 'RESOLVED' && (
                                <StatusForm request={request} onUpdated={setRequest} />
                            )}
                        </aside>
                    </div>
                </>
            )}

            {confirmingDelete && (
                <ConfirmDialog
                    title="Delete request"
                    message={`Delete "${request?.title || 'this request'}"? This cannot be undone.`}
                    busy={deleting}
                    onCancel={() => {
                        if (!deleting) setConfirmingDelete(false)
                    }}
                    onConfirm={confirmDelete}
                />
            )}
        </section>
    )
}
