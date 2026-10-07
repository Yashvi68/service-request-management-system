import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import requestRoutes from './routes/request.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import { notFound, errorHandler } from './middlewares/error.middleware.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        message: 'Service Request Management API is running',
    })
})

app.use('/api/auth', authRoutes)
app.use('/api/requests', requestRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use(notFound)
app.use(errorHandler)

export default app