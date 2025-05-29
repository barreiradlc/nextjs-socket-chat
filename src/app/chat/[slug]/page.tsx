"use client"

import { useSocket } from '@/hooks/socket';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type MessageType = {
  message: string;
  socketId: string
}

export default function ChatRoom() {
  const { socket } = useSocket()
  const { slug: roomId } = useParams() as any

  const inputMessageRef = useRef<HTMLInputElement>(null)
  
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<MessageType[]>([])

  useEffect(() => {
    if(!socket || !roomId) return;
    socket?.emit('join-room', roomId)
    
    const updateMessagesList = (message: MessageType) => {
      setMessages((prev) => [...prev, message])
    }

    socket?.on('message', updateMessagesList)

    return () => {
      socket?.off('message', updateMessagesList)
    }
  },[socket, roomId])

   const sendMessage = () => {
    if (socket && input.trim() && roomId) {
      socket?.emit('message', {
        socketId: socket.id,
        roomId,
        message: input
      })

      setInput('')

      inputMessageRef.current?.focus()
    }
  }

  return (
    <main className='p-8 max-w-full'>
      <div className='w-xs rounded-sm p-4 bg:gray-900'>
      <h1>Socket.IO Chat</h1>
        <div className='flex flex-row my-8 border rounded-sm p-2'>
          <input
            ref={inputMessageRef}
            placeholder="Type your message..."
            className='rounded-sm w-full bg-gray-800 placeholder-gray-500 px-2 mx-2'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            className='border rounded-sm py-1 px-4'
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
        {messages && messages.length ? 
          <ul className='rounded-sm p-2 animate-fade-in-up delay-300'>
            {messages.map(({ message, socketId }, i) => {
              const variant = socketId === socket?.id ? 'bg-gray-600 mr-4' : 'bg-gray-800 ml-4'
            
              return(
                <li 
                  className={`animate-fade-in-up delay-300 rounded-sm p-2 my-2 ${variant}`}
                  key={i}
                >
                  {message}
                </li>
            )})}
          </ul>
          :
          <span>No messages yet</span>
        }
      </div>
    </main>
  )
}
