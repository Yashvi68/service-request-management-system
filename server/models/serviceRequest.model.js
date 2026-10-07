import pool from '../config/db.js'

const REQUEST_COLUMNS = `
    id, user_id, title, description, category, priority, status, created_at, updated_at
`

const createServiceRequest = async ({
    user_id,
    title,
    description,
    category,
    priority,
    status,
}) => {
    const columns = ['user_id', 'title', 'description', 'category']
    const values = [user_id, title, description, category]

    if (priority !== undefined) {
        columns.push('priority')
        values.push(priority)
    }

    if (status !== undefined) {
        columns.push('status')
        values.push(status)
    }

    const placeholders = values.map((_, index) => `$${index + 1}`)
    const query = `
        INSERT INTO service_requests (${columns.join(', ')})
        VALUES (${placeholders.join(', ')})
        RETURNING *
    `

    const { rows } = await pool.query(query, values)
    return rows[0]
}

const findServiceRequests = async ({ userId, status, priority } = {}) => {
    const conditions = []
    const values = []

    if (userId !== undefined && userId !== null) {
        values.push(userId)
        conditions.push(`user_id = $${values.length}`)
    }

    if (status) {
        values.push(status)
        conditions.push(`status = $${values.length}`)
    }

    if (priority) {
        values.push(priority)
        conditions.push(`priority = $${values.length}`)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    const query = `
        SELECT ${REQUEST_COLUMNS}
        FROM service_requests
        ${whereClause}
        ORDER BY created_at DESC, id DESC
    `

    const { rows } = await pool.query(query, values)
    return rows
}

const findServiceRequestById = async (id) => {
    const query = `
        SELECT ${REQUEST_COLUMNS}
        FROM service_requests
        WHERE id = $1
    `

    const { rows } = await pool.query(query, [id])
    return rows[0] || null
}

const updateServiceRequest = async (id, fields) => {
    const allowed = ['title', 'description', 'category', 'priority']
    const values = []
    const sets = []

    for (const column of allowed) {
        if (fields[column] !== undefined) {
            values.push(fields[column])
            sets.push(`${column} = $${values.length}`)
        }
    }

    if (sets.length === 0) {
        return null
    }

    sets.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)

    const query = `
        UPDATE service_requests
        SET ${sets.join(', ')}
        WHERE id = $${values.length}
        RETURNING ${REQUEST_COLUMNS}
    `

    const { rows } = await pool.query(query, values)
    return rows[0] || null
}

const updateServiceRequestStatus = async (id, status) => {
    const query = `
        UPDATE service_requests
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING ${REQUEST_COLUMNS}
    `

    const { rows } = await pool.query(query, [status, id])
    return rows[0] || null
}

const deleteServiceRequest = async (id) => {
    const query = `
        DELETE FROM service_requests
        WHERE id = $1
        RETURNING ${REQUEST_COLUMNS}
    `

    const { rows } = await pool.query(query, [id])
    return rows[0] || null
}

const getDashboardSummary = async () => {
    const query = `
        SELECT
            COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE status = 'OPEN')::int AS open,
            COUNT(*) FILTER (WHERE status = 'IN_PROGRESS')::int AS in_progress,
            COUNT(*) FILTER (WHERE status = 'RESOLVED')::int AS resolved,
            COUNT(*) FILTER (WHERE priority = 'HIGH')::int AS high_priority
        FROM service_requests
    `

    const { rows } = await pool.query(query)
    return rows[0]
}

export {
    createServiceRequest,
    findServiceRequests,
    findServiceRequestById,
    updateServiceRequest,
    updateServiceRequestStatus,
    deleteServiceRequest,
    getDashboardSummary,
}
