export const ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER',
}

export const CATEGORIES = [
    { value: 'IT', label: 'IT' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'GENERAL', label: 'General' },
]

export const PRIORITIES = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
]

export const STATUSES = [
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In progress' },
    { value: 'RESOLVED', label: 'Resolved' },
]

export const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.map((item) => [item.value, item.label]))
export const PRIORITY_LABELS = Object.fromEntries(PRIORITIES.map((item) => [item.value, item.label]))
export const STATUS_LABELS = Object.fromEntries(STATUSES.map((item) => [item.value, item.label]))

export function homePath(role) {
    return role === ROLES.ADMIN ? '/dashboard' : '/home'
}

export function labelFor(labels, value) {
    return labels[value] || value || '—'
}
