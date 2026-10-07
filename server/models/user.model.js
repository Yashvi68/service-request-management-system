import pool from '../config/db.js'

const createUser = async ({ name, email, password }) => {
    const query = `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, role, created_at, updated_at
    `

    const { rows } = await pool.query(query, [name, email, password])
    return rows[0]
}

const findUserByEmail = async (email) => {
    const query = `
        SELECT id, name, email, password, role, created_at, updated_at
        FROM users
        WHERE email = $1
    `

    const { rows } = await pool.query(query, [email])
    return rows[0] || null
}

const findUserById = async (id) => {
    const query = `
        SELECT id, name, email, role, created_at, updated_at
        FROM users
        WHERE id = $1
    `

    const { rows } = await pool.query(query, [id])
    return rows[0] || null
}

export {
    createUser,
    findUserByEmail,
    findUserById,
}
