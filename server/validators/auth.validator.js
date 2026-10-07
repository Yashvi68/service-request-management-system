import Joi from 'joi'

const nameField = Joi.string().trim().min(1).max(100).required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name is required',
    'string.min': 'Name is required',
    'string.max': 'Name must be at most 100 characters',
    'any.required': 'Name is required',
})

const emailField = Joi.string().trim().lowercase().email().max(255).required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
    'string.max': 'Email must be at most 255 characters',
    'any.required': 'Email is required',
})

const passwordField = Joi.string().min(8).max(72).required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password must be at most 72 characters',
    'any.required': 'Password is required',
})

export const registerSchema = Joi.object({
    name: nameField,
    email: emailField,
    password: passwordField,
})

export const loginSchema = Joi.object({
    email: emailField,
    password: Joi.string().required().messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password is required',
        'any.required': 'Password is required',
    }),
})
