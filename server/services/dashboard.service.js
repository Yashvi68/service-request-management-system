import { getDashboardSummary } from '../models/serviceRequest.model.js'

const getSummary = async () => {
    const row = await getDashboardSummary()

    return {
        total: row.total,
        open: row.open,
        inProgress: row.in_progress,
        resolved: row.resolved,
        highPriority: row.high_priority,
    }
}

export { getSummary }
