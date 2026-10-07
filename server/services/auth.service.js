import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { createUser, findUserByEmail } from '../models/user.model.js'
import AppError from '../utils/appError.js'

const SALT_ROUNDS = 10

const toPublicUser = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
})

const register = async ({ name, email, password }) => {
    const existingUser = await findUserByEmail(email)

    if (existingUser) {
        throw new AppError('Email is already registered', 409)
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await createUser({
        name,
        email,
        password: hashedPassword,
    })

    return toPublicUser(user)
}

const login = async ({ email, password }) => {
    const user = await findUserByEmail(email)

    if (!user) {
        throw new AppError('Invalid email or password', 401)
    }

    const passwordMatches = await bcrypt.compare(password, user.password)

    if (!passwordMatches) {
        throw new AppError('Invalid email or password', 401)
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    )

    return {
        token,
        user: toPublicUser(user),
    }
}

export {
    register,
    login,
}
