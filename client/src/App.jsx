import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ROLES } from './constants/options.js'
import { AuthProvider } from './context/AuthContext.jsx'
import { GuestRoute, HomeRedirect, ProtectedRoute } from './components/RouteGuards.jsx'
import AppLayout from './layouts/AppLayout.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import RequestListPage from './pages/RequestListPage.jsx'
import CreateRequestPage from './pages/CreateRequestPage.jsx'
import EditRequestPage from './pages/EditRequestPage.jsx'
import RequestDetailsPage from './pages/RequestDetailsPage.jsx'

function AppRoutes() {
    return (
        <Routes>
            <Route element={<GuestRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route path="/requests" element={<RequestListPage />} />
                    <Route element={<ProtectedRoute roles={[ROLES.USER]} />}>
                        <Route path="/requests/new" element={<CreateRequestPage />} />
                        <Route path="/requests/:id/edit" element={<EditRequestPage />} />
                    </Route>
                    <Route path="/requests/:id" element={<RequestDetailsPage />} />
                    <Route element={<ProtectedRoute roles={[ROLES.ADMIN]} />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                    </Route>
                </Route>
            </Route>

            <Route path="/" element={<HomeRedirect />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
            <AppRoutes />
        </AuthProvider>
    )
}
