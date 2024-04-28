import expres, {Application} from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db'
import projectRoutes from './routes/projectRoutes'

dotenv.config()
connectDB()

const app: Application = expres()

app.use(expres.json())

app.use('/api/v1/projects', projectRoutes)

export default app