import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import RequestForm from '../components/RequestForm.jsx'
import { ErrorState, LoadingState } from '../components/PageState.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { getRequest, updateRequest } from '../services/requestService.js'
import { getErrorMessage, isUnauthorized } from '../utils/getErrorMessage.js'
import { canEditRequest } from '../utils/requestPermissions.js'

export default function EditRequestPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [request, setRequest] = useState(null)
    const [loading, setLoading] = useState(true)
    const [pageError, setPageError] = useState(null)
    const [formError, setFormError] = useState('')
    const [reloadKey, setReloadKey] = useState(0)

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

    const handleSubmit = async (values) => {
        setFormError('')

        try {
            const response = await updateRequest(id, values)
            toast.success(response.message || 'Request updated')
            navigate(`/requests/${id}`)
        } catch (error) {
            if (!isUnauthorized(error)) {
                setFormError(getErrorMessage(error, 'Could not update the request'))
            }
        }
    }

    return (
        <section className="panel narrow">
            <Link className="back-link" to={request ? `/requests/${id}` : '/requests'}>Back</Link>
            <header className="page-header">
                <div>
                    <p className="eyebrow">Edit</p>
                    <h1>Edit request</h1>
                </div>
            </header>

            {loading && <LoadingState label="Loading request..." />}
            {!loading && pageError && (
                <ErrorState
                    message={pageError.message}
                    onRetry={pageError.retry ? () => setReloadKey((value) => value + 1) : undefined}
                />
            )}

            {!loading && !pageError && request && !canEditRequest(user, request) && (
                <ErrorState message="This request can no longer be edited." />
            )}

            {!loading && !pageError && request && canEditRequest(user, request) && (
                <>
                    {formError && <p className="form-alert" role="alert">{formError}</p>}
                    <RequestForm
                        initialValues={request}
                        submitLabel="Save changes"
                        cancelTo={`/requests/${id}`}
                        onSubmit={handleSubmit}
                    />
                </>
            )}
        </section>
    )
}
