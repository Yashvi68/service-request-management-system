import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import AuthLayout from '../layouts/AuthLayout.jsx'
import FormField from '../components/FormField.jsx'
import PasswordField from '../components/PasswordField.jsx'
import { registerAccount } from '../services/authService.js'
import { getErrorMessage } from '../utils/getErrorMessage.js'

export default function RegisterPage() {
    const navigate = useNavigate()
    const [formError, setFormError] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: 'onTouched',
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (values) => {
        setFormError('')

        try {
            const response = await registerAccount({
                name: values.name.trim(),
                email: values.email.trim(),
                password: values.password,
            })
            toast.success(response.message || 'Account created')
            navigate('/login', { replace: true })
        } catch (error) {
            setFormError(getErrorMessage(error, 'Could not create the account'))
        }
    }

    return (
        <AuthLayout
            title="Create an account"
            subtitle="Registration creates a standard user. An administrator account is set up separately."
            footer={
                <p>
                    Already registered? <Link to="/login">Sign in</Link>
                </p>
            }
        >
            <form className="stack-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                {formError && <p className="form-alert" role="alert">{formError}</p>}

                <FormField id="name" label="Name" error={errors.name?.message}>
                    <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        maxLength={100}
                        aria-invalid={errors.name ? 'true' : undefined}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        {...register('name', {
                            required: 'Name is required',
                            validate: (value) => value.trim().length > 0 || 'Name is required',
                            maxLength: { value: 100, message: 'Name must be at most 100 characters' },
                        })}
                    />
                </FormField>

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
                        autoComplete="new-password"
                        aria-invalid={errors.password ? 'true' : undefined}
                        aria-describedby={errors.password ? 'password-error' : undefined}
                        {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 8, message: 'Password must be at least 8 characters' },
                            maxLength: { value: 72, message: 'Password must be at most 72 characters' },
                        })}
                    />
                </FormField>

                <FormField id="confirmPassword" label="Confirm password" error={errors.confirmPassword?.message}>
                    <PasswordField
                        id="confirmPassword"
                        autoComplete="new-password"
                        aria-invalid={errors.confirmPassword ? 'true' : undefined}
                        aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                        {...register('confirmPassword', {
                            required: 'Confirm your password',
                            validate: (value, formValues) => value === formValues.password || 'Passwords do not match',
                        })}
                    />
                </FormField>

                <button type="submit" className="button primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating account...' : 'Create account'}
                </button>
            </form>
        </AuthLayout>
    )
}
