import asyncHandler from '../utils/asyncHandler.js'
import {
    createRequest as createRequestRecord,
    getRequests as getRequestRecords,
    getRequestById,
    updateRequest as updateRequestRecord,
    removeRequest,
    changeRequestStatus,
} from '../services/request.service.js'

const createRequest = asyncHandler(async (req, res) => {
    const request = await createRequestRecord(req.user, req.body)

    res.status(201).json({
        success: true,
        message: 'Service request created',
        data: request,
    })
})

const getRequests = asyncHandler(async (req, res) => {
    const requests = await getRequestRecords(req.user, req.filters)

    res.status(200).json({
        success: true,
        message: 'Service requests fetched',
        data: requests,
    })
})

const getRequest = asyncHandler(async (req, res) => {
    const request = await getRequestById(req.params.id, req.user)

    res.status(200).json({
        success: true,
        message: 'Service request fetched',
        data: request,
    })
})

const updateRequest = asyncHandler(async (req, res) => {
    const request = await updateRequestRecord(req.params.id, req.user, req.body)

    res.status(200).json({
        success: true,
        message: 'Service request updated',
        data: request,
    })
})

const deleteRequest = asyncHandler(async (req, res) => {
    const request = await removeRequest(req.params.id, req.user)

    res.status(200).json({
        success: true,
        message: 'Service request deleted',
        data: request,
    })
})

const updateRequestStatus = asyncHandler(async (req, res) => {
    const request = await changeRequestStatus(req.params.id, req.body.status)

    res.status(200).json({
        success: true,
        message: 'Service request status updated',
        data: request,
    })
})

export {
    createRequest,
    getRequests,
    getRequest,
    updateRequest,
    deleteRequest,
    updateRequestStatus,
}
