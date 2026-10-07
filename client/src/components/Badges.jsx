import { labelFor, PRIORITY_LABELS, STATUS_LABELS, CATEGORY_LABELS } from '../constants/options.js'
import './Badges.scss'

export function StatusBadge({ status }) {
    return <span className={`badge status-${status}`}>{labelFor(STATUS_LABELS, status)}</span>
}

export function PriorityBadge({ priority }) {
    return <span className={`badge priority-${priority}`}>{labelFor(PRIORITY_LABELS, priority)}</span>
}

export function CategoryBadge({ category }) {
    return <span className="badge category">{labelFor(CATEGORY_LABELS, category)}</span>
}
