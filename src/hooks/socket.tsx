import { getSocket } from "@/lib/socket";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { DefaultEventsMap } from "socket.io";
import { Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
}

const SocketContext = createContext({} as SocketContextType)

type SocketContextProviderProps = {
  children: ReactNode;
}

function SocketContextProvider({ children }: SocketContextProviderProps) {
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null)

  useEffect(() => {
    const socketInstance = getSocket()

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id)
    })

    socketInstance.on('disconnect', () => {
      console.log('Disconnected:', socketInstance.id)
    })

    setSocket(socketInstance)

    return () => {  
      socketInstance.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={{ 
      socket
     }}>
      {children}
    </SocketContext.Provider>
  )
}

function useSocket() {
  const context = useContext(SocketContext)

  return context
}

export { SocketContext, SocketContextProvider, useSocket };
