export function isUnauthorized(error) {
    return error?.response?.status === 401
}

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
    const message = error?.response?.data?.message

    if (typeof message === 'string' && message.trim()) {
        return message
    }

    if (!error?.response) {
        return 'Cannot reach the server. Check that the API is running.'
    }

    return fallback
}
