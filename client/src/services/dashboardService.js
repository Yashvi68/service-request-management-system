import api from './api.js'

export async function getDashboardSummary() {
    const { data } = await api.get('/api/dashboard/summary')
    return data.data
}
