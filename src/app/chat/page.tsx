"use client"

import { useSocket } from '@/hooks/socket'
import { useEffect, useRef, useState } from 'react'

type MessageType = {
  message: string;
  socketId: string
}

export default function ChatRoom() {
  const inputMessageRef = useRef<HTMLInputElement>(null)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<MessageType[]>([])
  const { socket } = useSocket()

  const sendMessage = () => {
    if (socket && input.trim()) {
      socket?.emit('message', {
        message: input,
        socketId: socket.id
      })
      setInput('')

      inputMessageRef.current?.focus()
    }
  }
  
  useEffect(() => {
    socket?.on('message', (msg) => {
      setMessages((prev) => [...prev, msg])
    })
  },[socket?.id])

  return (
    <main className='p-8 '>
      <div className='w-xs rounded-sm p-4 bg:gray-900'>
      <h1>Socket.IO Chat</h1>
        <div className='flex flex-row my-8 border rounded-sm py-2 px-2'>
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
          <ul className='rounded-sm p-2'>
            {messages.map(({ message, socketId }, i) => {
              const variant = socketId === socket?.id ? 'bg-gray-600 mr-4' : 'bg-gray-800 ml-4'
            
              return(
                <li 
                  className={`transition-all ease-in-out animate-[wiggle_1s_ease-in-out_infinite] rounded-sm p-2 my-2 ${variant}`}
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
