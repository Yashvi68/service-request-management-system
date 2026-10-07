import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import RequestForm from '../components/RequestForm.jsx'
import { createRequest } from '../services/requestService.js'
import { getErrorMessage, isUnauthorized } from '../utils/getErrorMessage.js'
import './CreateRequestPage.scss'

export default function CreateRequestPage() {
    const navigate = useNavigate()
    const [formError, setFormError] = useState('')

    const handleSubmit = async (values) => {
        setFormError('')

        try {
            const response = await createRequest(values)
            toast.success(response.message || 'Request created')
            navigate(`/requests/${response.data.id}`)
        } catch (error) {
            if (!isUnauthorized(error)) {
                setFormError(getErrorMessage(error, 'Could not create the request'))
            }
        }
    }

    return (
        <section className="panel narrow create-request">
            <header className="page-header">
                <div>
                    <h1>Create a request</h1>
                    <p className="lede">Enter details to open a new request.</p>
                </div>
            </header>

            {formError && <p className="form-alert" role="alert">{formError}</p>}

            <RequestForm
                submitLabel="Create request"
                cancelTo="/requests"
                onSubmit={handleSubmit}
            />
        </section>
    )
}
