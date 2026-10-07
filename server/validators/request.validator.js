import Joi from 'joi'

const CATEGORIES = ['IT', 'MAINTENANCE', 'GENERAL']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH']
const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED']

const titleField = Joi.string().trim().min(1).max(200).messages({
    'string.base': 'Title must be a string',
    'string.empty': 'Title is required',
    'string.min': 'Title is required',
    'string.max': 'Title must be at most 200 characters',
    'any.required': 'Title is required',
})

const descriptionField = Joi.string().trim().min(1).max(5000).messages({
    'string.base': 'Description must be a string',
    'string.empty': 'Description is required',
    'string.min': 'Description is required',
    'string.max': 'Description must be at most 5000 characters',
    'any.required': 'Description is required',
})

const categoryField = Joi.string().trim().uppercase().valid(...CATEGORIES).messages({
    'string.base': 'Category must be a string',
    'string.empty': 'Category is required',
    'any.only': 'Category must be IT, MAINTENANCE, or GENERAL',
    'any.required': 'Category is required',
})

const priorityField = Joi.string().trim().uppercase().valid(...PRIORITIES).messages({
    'string.base': 'Priority must be a string',
    'string.empty': 'Priority is required',
    'any.only': 'Priority must be LOW, MEDIUM, or HIGH',
    'any.required': 'Priority is required',
})

const statusField = Joi.string().trim().uppercase().valid(...STATUSES).messages({
    'string.base': 'Status must be a string',
    'string.empty': 'Status is required',
    'any.only': 'Status must be OPEN, IN_PROGRESS, or RESOLVED',
    'any.required': 'Status is required',
})

export const createRequestSchema = Joi.object({
    title: titleField.required(),
    description: descriptionField.required(),
    category: categoryField.required(),
    priority: priorityField.required(),
    status: statusField.optional(),
})

export const updateRequestSchema = Joi.object({
    title: titleField,
    description: descriptionField,
    category: categoryField,
    priority: priorityField,
}).min(1).messages({
    'object.min': 'At least one field is required to update a service request',
})

export const statusSchema = Joi.object({
    status: statusField.required(),
})

export const requestIdSchema = Joi.object({
    id: Joi.number().integer().positive().required().messages({
        'number.base': 'Request id must be a positive integer',
        'number.integer': 'Request id must be a positive integer',
        'number.positive': 'Request id must be a positive integer',
        'any.required': 'Request id is required',
    }),
})

export const requestFilterSchema = Joi.object({
    status: statusField.optional(),
    priority: priorityField.optional(),
})
