import { Server } from 'socket.io'
import { Server as HttpServer } from "node:http"

let io: Server

interface Message {
    author: string,
    content: string
}

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
        let chatRoom: string | undefined

        socket.on('joinChat', (bingoId) => {
            chatRoom = `chat-${bingoId}`
            socket.join(chatRoom)
        })

        socket.on('message', (message) => {
            console.log(socket)
            socket.to(chatRoom).emit('newMessage', {
                author: "Someone else",
                content: message
            })
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