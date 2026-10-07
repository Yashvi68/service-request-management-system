import { ROLES } from '../constants/options.js'

const EDITABLE_STATUSES = ['OPEN', 'IN_PROGRESS']

export function canEditRequest(user, request) {
    if (!user || !request || user.role !== ROLES.USER) {
        return false
    }

    if (request.user_id !== user.id) {
        return false
    }

    return EDITABLE_STATUSES.includes(request.status)
}
