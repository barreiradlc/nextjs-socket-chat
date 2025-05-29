"use client";

import React from "react";
import { SocketContextProvider } from "@/hooks/socket";
import { ChatRoomsContextProvider } from "@/hooks/chatRoom";

export default function ParentProvider({
    children
}: {
    children: React.ReactNode
}) {
    return (
      <SocketContextProvider>
        <ChatRoomsContextProvider>
          {children}
        </ChatRoomsContextProvider>
      </SocketContextProvider>
    )
}