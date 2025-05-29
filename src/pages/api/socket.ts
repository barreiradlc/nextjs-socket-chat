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

    // console.log({ io })

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      socket.on('message', (msg) => {
        console.log('Message received:', msg)
        io.emit('message', msg) // broadcast to all clients
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
