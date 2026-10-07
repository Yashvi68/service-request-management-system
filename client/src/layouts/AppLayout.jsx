import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { ROLES, homePath } from '../constants/options.js'
import { useAuth } from '../hooks/useAuth.js'
import './AppLayout.scss'

export default function AppLayout() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [confirmingLogout, setConfirmingLogout] = useState(false)

    if (!user) return null

    const isAdmin = user.role === ROLES.ADMIN

    const handleLogout = () => {
        logout()
        toast.success('You have been logged out')
        navigate('/login', { replace: true })
    }

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <NavLink to={homePath(user.role)} className="brand">
                    Service Requests
                </NavLink>

                <nav className="nav" aria-label="Main">
                    {isAdmin ? (
                        <NavLink to="/dashboard" end className="nav-link">
                            Dashboard
                        </NavLink>
                    ) : (
                        <NavLink to="/home" end className="nav-link">
                            Home
                        </NavLink>
                    )}
                    <NavLink to="/requests" end className="nav-link">
                        Requests
                    </NavLink>
                </nav>
            </aside>

            <div className="workspace">
                <header className="topbar">
                    <div className="topbar-inner">
                        <span className="user-name">Welcome, {user.name}</span>
                        <button type="button" className="button secondary small" onClick={() => setConfirmingLogout(true)}>
                            Log out
                        </button>
                    </div>
                </header>

                <main className="page">
                    <Outlet />
                </main>
            </div>

            {confirmingLogout && (
                <ConfirmDialog
                    title="Log out"
                    message="Are you sure you want to log out?"
                    confirmLabel="Log out"
                    onCancel={() => setConfirmingLogout(false)}
                    onConfirm={handleLogout}
                />
            )}
        </div>
    )
}
