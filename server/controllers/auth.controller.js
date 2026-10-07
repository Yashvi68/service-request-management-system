import asyncHandler from '../utils/asyncHandler.js'
import { register as registerUser, login as loginUser } from '../services/auth.service.js'

const register = asyncHandler(async (req, res) => {
    const user = await registerUser(req.body)

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user,
    })
})

const login = asyncHandler(async (req, res) => {
    const result = await loginUser(req.body)

    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
    })
})

export {
    register,
    login,
}
