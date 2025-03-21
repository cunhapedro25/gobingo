import { Server } from 'socket.io'
import { Server as HttpServer } from "node:http"

let io: Server

export const initIO = (httpServer: HttpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: '*'
        }
    })

    io.engine.use((req: any, res: any, next: any) => {
        next();
    })

    io.on('connection', (socket) => {
        socket.on('joinPoll', (pollId) => {
            socket.join(`poll-${pollId}`)
        })
        socket.on('joinHome', () => {
            socket.join("home")
        })
    })

    return io
}

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized')
    }
    return io
}