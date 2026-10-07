import {
    createServiceRequest,
    findServiceRequests,
    findServiceRequestById,
    updateServiceRequest,
    updateServiceRequestStatus,
    deleteServiceRequest,
} from '../models/serviceRequest.model.js'
import AppError from '../utils/appError.js'
import { clearDashboardCache } from '../config/redis.js'

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

const EDITABLE_STATUSES = ['OPEN', 'IN_PROGRESS']

const createRequest = async (user, body) => {
    if (user.role !== 'USER') {
        throw new AppError('You do not have permission to create a service request', 403)
    }

    if (body.status !== undefined) {
        throw new AppError('You do not have permission to set request status', 403)
    }

    const created = await createServiceRequest({
        user_id: user.id,
        title: body.title,
        description: body.description,
        category: body.category,
        priority: body.priority,
    })

    await clearDashboardCache()
    return created
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

    if (user.role !== 'USER' || existing.user_id !== user.id) {
        throw new AppError('You do not have permission to edit this service request', 403)
    }

    if (!EDITABLE_STATUSES.includes(existing.status)) {
        throw new AppError('Resolved requests cannot be edited', 403)
    }

    const updated = await updateServiceRequest(id, {
        title: body.title,
        description: body.description,
        category: body.category,
        priority: body.priority,
    })

    if (!updated) {
        throw new AppError('At least one field is required to update a service request', 400)
    }

    await clearDashboardCache()
    return updated
}

const removeRequest = async (id, user) => {
    const existing = await getRequestOrThrow(id)

    if (user.role !== 'USER' || existing.user_id !== user.id) {
        throw new AppError('You do not have permission to delete this service request', 403)
    }

    if (existing.status !== 'OPEN') {
        throw new AppError('Only open requests can be deleted', 403)
    }

    const deleted = await deleteServiceRequest(id)

    if (!deleted) {
        throw new AppError('Service request not found', 404)
    }

    await clearDashboardCache()
    return deleted
}

const changeRequestStatus = async (id, status) => {
    const existing = await getRequestOrThrow(id)

    if (existing.status === 'RESOLVED') {
        throw new AppError('A resolved request cannot change status', 403)
    }

    const updated = await updateServiceRequestStatus(id, status)

    if (!updated) {
        throw new AppError('Service request not found', 404)
    }

    await clearDashboardCache()
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
