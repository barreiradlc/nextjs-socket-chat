import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { Socket } from "socket.io";

type RoomType = {
  name: string
}

type ChatRoomsContextType = {
  rooms: RoomType[],
  setRooms: Dispatch<SetStateAction<RoomType[]>>
  createRoom: (roomId: string, name: string, socket: Socket | null) => void
}

const ChatRoomsContext = createContext({} as ChatRoomsContextType)

type ChatRoomsContextProviderProps = {
  children: ReactNode;
}

function ChatRoomsContextProvider({ children }: ChatRoomsContextProviderProps) {
  const [rooms, setRooms] = useState<RoomType[]>([] as RoomType[])

  function createRoom(roomId: string, name: string, socket: Socket | null) {
    setRooms((prev) => [...prev, {
      name,
      roomId,
      socket: socket?.id
    }])  
  }
  
  return (
    <ChatRoomsContext.Provider value={{
      rooms,
      setRooms,
      createRoom
     }}>
      {children}
    </ChatRoomsContext.Provider>
  )
}

function useChatRooms() {
  const context = useContext(ChatRoomsContext)

  return context
}

export { ChatRoomsContext, ChatRoomsContextProvider, useChatRooms };
