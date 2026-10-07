import AppError from '../utils/appError.js'

const validate = (schema, source = 'body') => (req, res, next) => {
    const input = req[source] ?? {}
    const { error, value } = schema.validate(input, {
        abortEarly: false,
        convert: true,
        errors: { wrap: { label: false } },
    })

    if (error) {
        const message = error.details.map((detail) => detail.message).join('; ')
        return next(new AppError(message, 400))
    }

    if (source === 'body') {
        req.body = value
    } else if (source === 'query') {
        req.filters = value
    } else if (source === 'params') {
        Object.assign(req.params, value)
    }

    next()
}

export default validate
