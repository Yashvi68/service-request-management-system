import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import AuthLayout from '../layouts/AuthLayout.jsx'
import FormField from '../components/FormField.jsx'
import PasswordField from '../components/PasswordField.jsx'
import { homePath } from '../constants/options.js'
import { useAuth } from '../hooks/useAuth.js'
import { consumeSessionNotice } from '../utils/authStorage.js'
import { getErrorMessage } from '../utils/getErrorMessage.js'

export default function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [formError, setFormError] = useState(() => consumeSessionNotice())

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: 'onTouched',
        defaultValues: { email: '', password: '' },
    })

    const onSubmit = async (values) => {
        setFormError('')

        try {
            const user = await login({
                email: values.email.trim(),
                password: values.password,
            })
            toast.success('Signed in successfully')
            const destination = location.state?.from && location.state.from !== '/login'
                ? location.state.from
                : homePath(user.role)
            navigate(destination, { replace: true })
        } catch (error) {
            setFormError(getErrorMessage(error, 'Could not sign in'))
        }
    }

    return (
        <AuthLayout
            title="Sign in"
            subtitle="Use the email and password for your service request account."
            footer={
                <p>
                    Need an account? <Link to="/register">Create one</Link>
                </p>
            }
        >
            <form className="stack-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                {formError && <p className="form-alert" role="alert">{formError}</p>}

                <FormField id="email" label="Email" error={errors.email?.message}>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        aria-invalid={errors.email ? 'true' : undefined}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Enter a valid email address',
                            },
                        })}
                    />
                </FormField>

                <FormField id="password" label="Password" error={errors.password?.message}>
                    <PasswordField
                        id="password"
                        autoComplete="current-password"
                        aria-invalid={errors.password ? 'true' : undefined}
                        aria-describedby={errors.password ? 'password-error' : undefined}
                        {...register('password', { required: 'Password is required' })}
                    />
                </FormField>

                <button type="submit" className="button primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                </button>
            </form>
        </AuthLayout>
    )
}
