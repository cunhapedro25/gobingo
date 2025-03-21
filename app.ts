import express from 'express'
import {fileURLToPath} from "node:url"
import * as path from "node:path"
import apiRoutes from "./routes/api.js"
import mongoose from "mongoose"
import 'dotenv/config'
import errorHandler from "./errorHandler.js"
import { createServer } from 'http'
import { initIO } from './socket.js'
import passport from "passport"
import session from "express-session"
import Admin from "./models/admin.js"

(async () => {

const app = express()
const PORT = process.env.PORT || 10000

if(!process.env.SESSION_SECRET) {
    console.log("No Session Secret defined!")
    process.exit(-1)
}

const httpServer = createServer(app)
const io = initIO(httpServer)

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    next()
})
app.use(errorHandler)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))
app.use(session({ secret: process.env.SESSION_SECRET!, resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use("/api", apiRoutes)
app.use((_, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

try {
    await mongoose.connect(process.env.MONGO_URL ?? "")

    if(await Admin.countDocuments() == 0 && process.env.ADMIN_EMAIL) {
        await Admin.create({
            email: process.env.ADMIN_EMAIL
        })
    }
} catch (e) {
    console.log(`MongoDB connection error: ${e}`)
}

httpServer.listen(PORT, () => {
    console.log(`Connected to mongoDB`)
    console.log(`Server running on http://localhost:${PORT}`)
})

})()