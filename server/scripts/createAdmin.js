import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import pool from '../config/db.js'

dotenv.config()

const SALT_ROUNDS = 10

const createAdmin = async () => {
    const name = process.env.ADMIN_NAME?.trim()
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
    const password = process.env.ADMIN_PASSWORD

    if (!name || !email || !password) {
        console.error('Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD before running this script.')
        process.exit(1)
    }

    if (!email.includes('@') || password.length < 8) {
        console.error('ADMIN_EMAIL must look like an email and ADMIN_PASSWORD must be at least 8 characters.')
        process.exit(1)
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])

    if (existing.rows[0]) {
        const { rows } = await pool.query(
            `
            UPDATE users
            SET name = $1, password = $2, role = 'ADMIN', updated_at = CURRENT_TIMESTAMP
            WHERE email = $3
            RETURNING id, name, email, role
            `,
            [name, hashedPassword, email]
        )

        console.log('Existing user promoted to ADMIN:', rows[0])
    } else {
        const { rows } = await pool.query(
            `
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, 'ADMIN')
            RETURNING id, name, email, role
            `,
            [name, email, hashedPassword]
        )

        console.log('ADMIN user created:', rows[0])
    }
}

createAdmin()
    .catch((error) => {
        console.error('Failed to create ADMIN user:', error.message)
        process.exitCode = 1
    })
    .finally(async () => {
        await pool.end()
    })
