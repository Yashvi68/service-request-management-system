import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAccount } from '../services/authService.js'
import { setUnauthorizedHandler } from '../services/api.js'
import { AuthContext } from './auth-context.js'
import {
    markSessionExpired,
    readStoredAuth,
    writeStoredAuth,
    clearStoredAuth,
} from '../utils/authStorage.js'

function toSessionUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }
}

export function AuthProvider({ children }) {
    const navigate = useNavigate()
    const [auth, setAuth] = useState(() => readStoredAuth())

    useEffect(() => {
        setUnauthorizedHandler(() => {
            markSessionExpired()
            setAuth(null)
            navigate('/login', { replace: true })
        })

        return () => setUnauthorizedHandler(null)
    }, [navigate])

    const login = async (credentials) => {
        const result = await loginAccount(credentials)
        const nextAuth = {
            token: result.token,
            user: toSessionUser(result.user),
        }

        writeStoredAuth(nextAuth)
        setAuth(nextAuth)
        return nextAuth.user
    }

    const logout = () => {
        clearStoredAuth()
        setAuth(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user: auth?.user ?? null,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

