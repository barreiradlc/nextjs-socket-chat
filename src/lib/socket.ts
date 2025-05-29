// lib/socket.ts
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const getSocket = () => {
  if (!socket) {
    fetch('/api/socket') 
    socket = io({ path: '/api/socket_io' })
  }
  return socket
}
