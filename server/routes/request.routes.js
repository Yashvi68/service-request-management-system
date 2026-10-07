import { Router } from 'express'
import authenticate from '../middlewares/auth.middleware.js'
import authorizeRoles from '../middlewares/role.middleware.js'
import validate from '../middlewares/validate.middleware.js'
import {
    createRequestSchema,
    updateRequestSchema,
    statusSchema,
    requestIdSchema,
    requestFilterSchema,
} from '../validators/request.validator.js'
import {
    createRequest,
    getRequests,
    getRequest,
    updateRequest,
    deleteRequest,
    updateRequestStatus,
} from '../controllers/request.controller.js'

const router = Router()

router.use(authenticate)

router.post('/', authorizeRoles('USER'), validate(createRequestSchema), createRequest)

router.get('/', authorizeRoles('USER', 'ADMIN'), validate(requestFilterSchema, 'query'), getRequests)

router.patch(
    '/:id/status',
    authorizeRoles('ADMIN'),
    validate(requestIdSchema, 'params'),
    validate(statusSchema),
    updateRequestStatus
)

router.get('/:id', authorizeRoles('USER', 'ADMIN'), validate(requestIdSchema, 'params'), getRequest)

router.patch(
    '/:id',
    authorizeRoles('USER'),
    validate(requestIdSchema, 'params'),
    validate(updateRequestSchema),
    updateRequest
)

router.delete('/:id', authorizeRoles('USER', 'ADMIN'), validate(requestIdSchema, 'params'), deleteRequest)

export default router
