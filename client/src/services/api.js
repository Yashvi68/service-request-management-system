import axios from 'axios'
import { markSessionExpired, readStoredAuth } from '../utils/authStorage.js'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
})

let unauthorizedHandler = null

export function setUnauthorizedHandler(handler) {
    unauthorizedHandler = handler
}

api.interceptors.request.use((config) => {
    const auth = readStoredAuth()

    if (auth?.token) {
        config.headers.Authorization = `Bearer ${auth.token}`
    }

    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status
        const url = error?.config?.url || ''
        const isAuthAttempt = url.includes('/api/auth/login') || url.includes('/api/auth/register')

        if (status === 401 && !isAuthAttempt) {
            if (unauthorizedHandler) {
                unauthorizedHandler()
            } else {
                markSessionExpired()
                if (window.location.pathname !== '/login') {
                    window.location.assign('/login')
                }
            }
        }

        return Promise.reject(error)
    },
)

export default api
