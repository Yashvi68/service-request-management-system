import './FormField.scss'

export default function FormField({ id, label, error, required = false, reserveError = false, children }) {
    return (
        <div className="field">
            <label htmlFor={id}>
                {required && <span className="required-mark" aria-hidden="true">*</span>}
                {label}
            </label>
            {children}
            {(error || reserveError) && (
                <p id={`${id}-error`} className="field-error">
                    {error}
                </p>
            )}
        </div>
    )
}
