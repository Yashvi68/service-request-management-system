import illustration from '../assets/auth-illustration.svg'
import './AuthLayout.scss'

export default function AuthLayout({ title, subtitle, children, footer }) {
    return (
        <div className="auth-screen">
            <aside className="auth-art" aria-hidden="true">
                <img src={illustration} alt="" />
            </aside>

            <section className="auth-panel">
                <div className="auth-card">
                    <p className="eyebrow">Service Requests</p>
                    <h1>{title}</h1>
                    {subtitle && <p className="lede">{subtitle}</p>}
                    {children}
                    {footer && <div className="auth-footer">{footer}</div>}
                </div>
            </section>
        </div>
    )
}
