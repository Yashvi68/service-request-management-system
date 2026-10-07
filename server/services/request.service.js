import {
    createServiceRequest,
    findServiceRequests,
    findServiceRequestById,
    updateServiceRequest,
    updateServiceRequestStatus,
    deleteServiceRequest,
} from '../models/serviceRequest.model.js'
import AppError from '../utils/appError.js'

const getRequestOrThrow = async (id) => {
    const request = await findServiceRequestById(id)

    if (!request) {
        throw new AppError('Service request not found', 404)
    }

    return request
}

const assertCanAccess = (request, user) => {
    if (user.role === 'ADMIN') {
        return
    }

    if (request.user_id !== user.id) {
        throw new AppError('You do not have permission to access this service request', 403)
    }
}

const createRequest = async (user, body) => {
    if (body.status !== undefined && user.role !== 'ADMIN') {
        throw new AppError('You do not have permission to set request status', 403)
    }

    return createServiceRequest({
        user_id: user.id,
        title: body.title,
        description: body.description,
        category: body.category,
        priority: body.priority,
        status: user.role === 'ADMIN' ? body.status : undefined,
    })
}

const getRequests = async (user, filters = {}) => {
    return findServiceRequests({
        userId: user.role === 'ADMIN' ? undefined : user.id,
        status: filters.status,
        priority: filters.priority,
    })
}

const getRequestById = async (id, user) => {
    const request = await getRequestOrThrow(id)
    assertCanAccess(request, user)
    return request
}

const updateRequest = async (id, user, body) => {
    const existing = await getRequestOrThrow(id)
    assertCanAccess(existing, user)

    const updated = await updateServiceRequest(id, {
        title: body.title,
        description: body.description,
        category: body.category,
        priority: body.priority,
    })

    if (!updated) {
        throw new AppError('At least one field is required to update a service request', 400)
    }

    return updated
}

const removeRequest = async (id, user) => {
    const existing = await getRequestOrThrow(id)
    assertCanAccess(existing, user)

    const deleted = await deleteServiceRequest(id)

    if (!deleted) {
        throw new AppError('Service request not found', 404)
    }

    return deleted
}

const changeRequestStatus = async (id, status) => {
    await getRequestOrThrow(id)

    const updated = await updateServiceRequestStatus(id, status)

    if (!updated) {
        throw new AppError('Service request not found', 404)
    }

    return updated
}

export {
    createRequest,
    getRequests,
    getRequestById,
    updateRequest,
    removeRequest,
    changeRequestStatus,
}
