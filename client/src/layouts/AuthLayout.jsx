import './AuthLayout.scss'

export default function AuthLayout({ title, subtitle, children, footer }) {
    return (
        <div className="auth-screen">
            <div className="auth-card">
                <p className="eyebrow">Service Requests</p>
                <h1>{title}</h1>
                {subtitle && <p className="lede">{subtitle}</p>}
                {children}
                {footer && <div className="auth-footer">{footer}</div>}
            </div>
        </div>
    )
}
