import { Server } from 'socket.io'
import { Server as HttpServer } from "node:http"

let io: Server

export const initIO = (httpServer: HttpServer, sessionData: any) => {
    io = new Server(httpServer, {
        cors: {
            origin: '*'
        }
    })

    io.engine.use(sessionData)

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
            // @ts-ignore
            if(!socket.request.session.passport) {
                return
            }
            socket.to(chatRoom).emit('newMessage', {
                // @ts-ignore
                author: socket.request.session.passport.user.name,
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