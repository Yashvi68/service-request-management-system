import { forwardRef, useState } from 'react'
import { RiEyeCloseLine, RiEyeLine } from 'react-icons/ri'
import './PasswordField.scss'

const PasswordField = forwardRef(function PasswordField({ id, ...props }, ref) {
    const [visible, setVisible] = useState(false)

    return (
        <div className="password-field">
            <input
                {...props}
                ref={ref}
                id={id}
                type={visible ? 'text' : 'password'}
            />
            <button
                type="button"
                className="password-toggle"
                aria-label={visible ? 'Hide password' : 'Show password'}
                onClick={() => setVisible((current) => !current)}
            >
                {visible ? <RiEyeLine /> : <RiEyeCloseLine />}
            </button>
        </div>
    )
})

export default PasswordField
