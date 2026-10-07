import AppError from '../utils/appError.js'

const authorizeRoles = (...roles) => (req, res, next) => {
    if (!req.user) {
        return next(new AppError('Authentication token is missing', 401))
    }

    if (!roles.includes(req.user.role)) {
        return next(new AppError('You do not have permission to perform this action', 403))
    }

    next()
}

export default authorizeRoles
