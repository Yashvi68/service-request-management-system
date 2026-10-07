import { getDashboardSummary } from '../models/serviceRequest.model.js'
import { DASHBOARD_SUMMARY_KEY, getCache, setCache } from '../config/redis.js'

const getSummary = async () => {
    const cached = await getCache(DASHBOARD_SUMMARY_KEY)

    if (cached) {
        return cached
    }

    const row = await getDashboardSummary()
    const summary = {
        total: row.total,
        open: row.open,
        inProgress: row.in_progress,
        resolved: row.resolved,
        highPriority: row.high_priority,
    }

    await setCache(DASHBOARD_SUMMARY_KEY, summary)
    return summary
}

export { getSummary }
