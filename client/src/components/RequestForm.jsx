import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { CATEGORIES, PRIORITIES } from '../constants/options.js'
import FormField from './FormField.jsx'
import './RequestForm.scss'

const emptyValues = {
    title: '',
    description: '',
    category: '',
    priority: '',
}

export default function RequestForm({ initialValues, submitLabel, cancelTo, hint, onSubmit }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: 'onTouched',
        defaultValues: emptyValues,
    })

    useEffect(() => {
        if (!initialValues) return

        reset({
            title: initialValues.title ?? '',
            description: initialValues.description ?? '',
            category: initialValues.category ?? '',
            priority: initialValues.priority ?? '',
        })
    }, [initialValues, reset])

    const submit = async (values) => {
        await onSubmit({
            title: values.title.trim(),
            description: values.description.trim(),
            category: values.category,
            priority: values.priority,
        })
    }

    return (
        <form className="stack-form" onSubmit={handleSubmit(submit)} noValidate>
            <FormField id="title" label="Title" required error={errors.title?.message}>
                <input
                    id="title"
                    type="text"
                    maxLength={200}
                    placeholder="Enter request title..."
                    aria-invalid={errors.title ? 'true' : undefined}
                    aria-describedby={errors.title ? 'title-error' : undefined}
                    {...register('title', {
                        required: 'Title is required',
                        validate: (value) => value.trim().length > 0 || 'Title is required',
                        maxLength: { value: 200, message: 'Title must be at most 200 characters' },
                    })}
                />
            </FormField>

            <FormField id="description" label="Description" required error={errors.description?.message}>
                <textarea
                    id="description"
                    rows={5}
                    maxLength={5000}
                    placeholder="Provide details about the issue here..."
                    aria-invalid={errors.description ? 'true' : undefined}
                    aria-describedby={errors.description ? 'description-error' : undefined}
                    {...register('description', {
                        required: 'Description is required',
                        validate: (value) => value.trim().length > 0 || 'Description is required',
                        maxLength: { value: 5000, message: 'Description must be at most 5000 characters' },
                    })}
                />
            </FormField>

            <div className="form-grid">
                <FormField id="category" label="Category" required reserveError error={errors.category?.message}>
                    <select
                        id="category"
                        aria-invalid={errors.category ? 'true' : undefined}
                        aria-describedby={errors.category ? 'category-error' : undefined}
                        {...register('category', { required: 'Category is required' })}
                    >
                        <option value="">Choose IT, maintenance, or general</option>
                        {CATEGORIES.map((category) => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                </FormField>

                <FormField id="priority" label="Priority" required reserveError error={errors.priority?.message}>
                    <select
                        id="priority"
                        aria-invalid={errors.priority ? 'true' : undefined}
                        aria-describedby={errors.priority ? 'priority-error' : undefined}
                        {...register('priority', { required: 'Priority is required' })}
                    >
                        <option value="">How urgent is this?</option>
                        {PRIORITIES.map((priority) => (
                            <option key={priority.value} value={priority.value}>
                                {priority.label}
                            </option>
                        ))}
                    </select>
                </FormField>
            </div>

            {hint && <p className="hint">{hint}</p>}

            <div className="button-row">
                <button type="submit" className="button primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : submitLabel}
                </button>
                <Link className="button secondary" to={cancelTo}>
                    Cancel
                </Link>
            </div>
        </form>
    )
}
