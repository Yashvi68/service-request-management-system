import asyncHandler from '../utils/asyncHandler.js'
import { getSummary } from '../services/dashboard.service.js'

const getDashboardSummary = asyncHandler(async (req, res) => {
    const summary = await getSummary()

    res.status(200).json({
        success: true,
        message: 'Dashboard summary fetched',
        data: summary,
    })
})

export { getDashboardSummary }
