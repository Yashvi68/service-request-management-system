import dotenv from 'dotenv'
import { createClient } from 'redis'

dotenv.config()

const DASHBOARD_SUMMARY_KEY = 'dashboard:summary'
const url = process.env.REDIS_URL

let client = null
let reported = false

if (url) {
    client = createClient({ url })

    client.on('error', (error) => {
        if (!reported) {
            reported = true
            console.error('Redis unavailable:', error.message)
        }
    })

    client.on('ready', () => {
        reported = false
        console.log('Redis connected')
    })

    client.connect().catch((error) => {
        if (!reported) {
            reported = true
            console.error('Redis connection failed:', error.message)
        }
    })
}

async function getCache(key) {
    if (!client?.isReady) return null

    try {
        const value = await client.get(key)
        return value ? JSON.parse(value) : null
    } catch {
        return null
    }
}

async function setCache(key, value, ttlSeconds = 60) {
    if (!client?.isReady) return

    try {
        await client.set(key, JSON.stringify(value), { EX: ttlSeconds })
    } catch {
        // The database result is still returned when the cache write fails.
    }
}

async function clearDashboardCache() {
    if (!client?.isReady) return

    try {
        await client.del(DASHBOARD_SUMMARY_KEY)
    } catch {
        // A later read refreshes the summary if this delete fails.
    }
}

export {
    DASHBOARD_SUMMARY_KEY,
    getCache,
    setCache,
    clearDashboardCache,
}
