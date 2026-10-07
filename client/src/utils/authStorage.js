const STORAGE_KEY = 'srms_auth'
const SESSION_NOTICE_KEY = 'srms_notice'

export function readStoredAuth() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return null

        const parsed = JSON.parse(raw)
        if (!parsed?.token || !parsed?.user?.id || !parsed?.user?.role) {
            return null
        }

        return {
            token: parsed.token,
            user: {
                id: parsed.user.id,
                name: parsed.user.name,
                email: parsed.user.email,
                role: parsed.user.role,
            },
        }
    } catch {
        return null
    }
}

export function writeStoredAuth(auth) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
}

export function clearStoredAuth() {
    localStorage.removeItem(STORAGE_KEY)
}

export function markSessionExpired() {
    clearStoredAuth()
    sessionStorage.setItem(SESSION_NOTICE_KEY, 'Your session has expired. Please sign in again.')
}

export function consumeSessionNotice() {
    const notice = sessionStorage.getItem(SESSION_NOTICE_KEY)
    if (notice) {
        sessionStorage.removeItem(SESSION_NOTICE_KEY)
    }
    return notice || ''
}
