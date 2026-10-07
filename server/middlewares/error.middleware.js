const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    })
}

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }

    let statusCode = err.statusCode || 500
    let message = err.message || 'Internal server error'

    if (err.type === 'entity.parse.failed') {
        statusCode = 400
        message = 'Invalid JSON body'
    }

    if (err.code === '23505') {
        statusCode = 409
        message = err.constraint === 'users_email_key'
            ? 'Email is already registered'
            : 'Duplicate value'
    }

    if (err.code === '23503') {
        statusCode = 400
        message = 'Request could not be completed'
    }

    if (err.code === '22001') {
        statusCode = 400
        message = 'One or more fields exceed the allowed length'
    }

    if (statusCode >= 500) {
        console.error(err)
        message = 'Internal server error'
    }

    res.status(statusCode).json({
        success: false,
        message,
    })
}

export {
    notFound,
    errorHandler,
}
