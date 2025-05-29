import { NextApiResponseServerIO } from '@/types/next'
import { Server as NetServer } from 'http'
import { NextApiRequest } from 'next'
import { Server as IOServer } from 'socket.io'

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.io server...')
    const httpServer: NetServer = res.socket.server as NetServer
    const io = new IOServer(httpServer, {
      path: '/api/socket_io',
    })

    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id)

      socket.on('join-room', (roomId) => {
        socket.join(roomId)
        console.log(`${socket.id} joined room ${roomId}`)
      })

      socket.on('message', ({ roomId, message, socketId }) => {
        console.log(`${roomId} - ${message}`)
        io.to(roomId).emit('message', { 
          socketId,
          roomId, 
          message
         })
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })

    res.socket.server.io = io
  }

  res.end()
}

export default ioHandler
