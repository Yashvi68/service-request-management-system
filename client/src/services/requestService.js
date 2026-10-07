import api from './api.js'

export async function getRequests(filters = {}) {
    const params = {}

    if (filters.status) params.status = filters.status
    if (filters.priority) params.priority = filters.priority

    const { data } = await api.get('/api/requests', { params })
    return data.data
}

export async function getRequest(id) {
    const { data } = await api.get(`/api/requests/${id}`)
    return data.data
}

export async function createRequest(payload) {
    const { data } = await api.post('/api/requests', payload)
    return data
}

export async function updateRequest(id, payload) {
    const { data } = await api.patch(`/api/requests/${id}`, payload)
    return data
}

export async function deleteRequest(id) {
    const { data } = await api.delete(`/api/requests/${id}`)
    return data
}

export async function updateRequestStatus(id, status) {
    const { data } = await api.patch(`/api/requests/${id}/status`, { status })
    return data
}
