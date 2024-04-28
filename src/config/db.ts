import mongoose from 'mongoose'
import colors from 'colors'
import {exit} from 'node:process'

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.URL_MONGODB)
        const url = `${connection.connection.host}:${connection.connection.port}`
        console.log(colors.magenta.bold(`MongoDB Conectado en: ${url}`))
    } catch (error) {
        console.log(colors.red.bold(`Erro al conectar con la base de datos `) + error.message)
        exit(1)
    }
}