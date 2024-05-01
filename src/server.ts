import expres, {Application} from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { corsConfig } from './config/cors'
import { connectDB } from './config/db'
import projectRoutes from './routes/projectRoutes'
import authRoutes from './routes/authRoutes'
import morgan from 'morgan'

dotenv.config()
connectDB()

const app: Application = expres()

app.use(cors(corsConfig))

app.use(expres.json())
app.use(morgan('dev'))

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/projects', projectRoutes)

export default app