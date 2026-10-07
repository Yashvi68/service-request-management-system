import dotenv from 'dotenv'
import app from './app.js'
import pool from './config/db.js'

dotenv.config()

const PORT = process.env.PORT || 5000

const startServer = async () => {
    if (!process.env.JWT_SECRET) {
        console.error('Server startup failed: JWT_SECRET is not set')
        process.exit(1)
    }

    try {
        await pool.query('SELECT NOW()')

        console.log('Database connected successfully')

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
            console.log('Routes registered: /api/auth, /api/requests, /api/dashboard')
        })
    } catch (error) {
        console.error('Database connection failed:', error.message)
        process.exit(1)
    }
}

startServer()