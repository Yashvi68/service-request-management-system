import jwt from 'jsonwebtoken'
import { findUserById } from '../models/user.model.js'
import AppError from '../utils/appError.js'

const authenticate = async (req, res, next) => {
    try {
        const header = req.headers.authorization

        if (!header) {
            throw new AppError('Authentication token is missing', 401)
        }

        const [scheme, token] = header.trim().split(/\s+/)

        if (scheme?.toLowerCase() !== 'bearer' || !token) {
            throw new AppError('Authentication token is missing', 401)
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded?.id) {
            throw new AppError('Invalid or expired authentication token', 401)
        }

        const user = await findUserById(decoded.id)

        if (!user) {
            throw new AppError('Invalid or expired authentication token', 401)
        }

        // Role used later comes from the database row, not from the request body.
        req.user = user
        next()
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError' || error.name === 'NotBeforeError') {
            return next(new AppError('Invalid or expired authentication token', 401))
        }

        next(error)
    }
}

export default authenticate
