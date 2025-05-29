"use client";

import React from "react";
import { SocketContextProvider } from "@/hooks/socket";

export default function ParentProvider({
    children
}: {
    children: React.ReactNode
}) {
    return (
      <SocketContextProvider>
        {children}
      </SocketContextProvider>
    )
}