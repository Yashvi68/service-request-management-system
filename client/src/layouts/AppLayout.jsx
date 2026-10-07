import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ROLES, homePath } from '../constants/options.js'
import { useAuth } from '../hooks/useAuth.js'
import '../components/Badges.scss'
import './AppLayout.scss'

export default function AppLayout() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    if (!user) return null

    const isAdmin = user.role === ROLES.ADMIN

    const handleLogout = () => {
        logout()
        toast.success('You have been logged out')
        navigate('/login', { replace: true })
    }

    return (
        <div className="app-shell">
            <header className="topbar">
                <div className="topbar-inner">
                    <NavLink to={homePath(user.role)} className="brand">
                        Service Requests
                    </NavLink>

                    <nav className="nav" aria-label="Main">
                        {isAdmin && (
                            <NavLink to="/dashboard" end className="nav-link">
                                Dashboard
                            </NavLink>
                        )}
                        <NavLink to="/requests" end className="nav-link">
                            Requests
                        </NavLink>
                        {!isAdmin && (
                            <NavLink to="/requests/new" className="nav-link">
                                New request
                            </NavLink>
                        )}
                    </nav>

                    <div className="topbar-user">
                        <span className="user-name">{user.name}</span>
                        <span className={`badge role-${user.role}`}>{isAdmin ? 'Admin' : 'User'}</span>
                        <button type="button" className="button secondary small" onClick={handleLogout}>
                            Log out
                        </button>
                    </div>
                </div>
            </header>

            <main className="page">
                <Outlet />
            </main>
        </div>
    )
}
