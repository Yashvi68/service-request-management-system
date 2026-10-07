import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { homePath } from '../constants/options.js'
import { useAuth } from '../hooks/useAuth.js'

export function ProtectedRoute({ roles }) {
    const { user } = useAuth()
    const location = useLocation()

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to={homePath(user.role)} replace />
    }

    return <Outlet />
}

export function GuestRoute() {
    const { user } = useAuth()

    if (user) {
        return <Navigate to={homePath(user.role)} replace />
    }

    return <Outlet />
}

export function HomeRedirect() {
    const { user } = useAuth()

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <Navigate to={homePath(user.role)} replace />
}
