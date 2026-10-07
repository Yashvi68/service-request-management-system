import { Router } from 'express'
import authenticate from '../middlewares/auth.middleware.js'
import authorizeRoles from '../middlewares/role.middleware.js'
import { getDashboardSummary } from '../controllers/dashboard.controller.js'

const router = Router()

router.get('/summary', authenticate, authorizeRoles('ADMIN'), getDashboardSummary)

export default router
