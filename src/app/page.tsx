"use client"
import { useChatRooms } from '@/hooks/chatRoom';
import { useSocket } from '@/hooks/socket';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { Socket } from 'socket.io';

export default function Chat() {
  const router = useRouter()
  const { socket } = useSocket()
  const { createRoom } = useChatRooms()

  const inputMessageRef = useRef<HTMLInputElement>(null)
  
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (socket && input.trim()) {
      const roomId = nanoid(6)
      createRoom(roomId, input, socket as unknown as Socket)
      router.push(`/chat/${roomId}`)
    }
  }

  return (
    <main className='p-8'>
      <div className='w-xs rounded-sm p-4'>
      <article className='prose prose-h1:text-white prose-h3:text-white'>
        <h1>Socket.IO Chat</h1>
        <h3>Create or find a chat</h3>
      </article>
        <div className='flex flex-row my-8 border rounded-sm py-2 px-2'>
          <input
            ref={inputMessageRef}
            placeholder="Create a new room"
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
      </div>
    </main>
  )
}
