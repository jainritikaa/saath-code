"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "./_components/navbar";
import { Header } from "./_components/header";
import { Register } from "@/app/_components/register";
import { socket } from "../lib/socket"; // Ensure this path is correct
import CodeEditor from "./_components/editor"; // Ensure this path is correct


interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [transport, setTransport] = useState<string>("N/A");
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [user, setUser] = useState<string>("user");
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("https://github.com/shadcn.png");
  const [buttonState, setButtonState] = useState<boolean>(false); // Add state for button

  const members = [
  { imageUrl: "https://randomuser.me/api/portraits/men/1.jpg", fallback: "M1" },
  { imageUrl: "https://randomuser.me/api/portraits/women/1.jpg", fallback: "W1" },
  { imageUrl: "https://randomuser.me/api/portraits/men/2.jpg", fallback: "M2" },
  { imageUrl: "https://randomuser.me/api/portraits/women/2.jpg", fallback: "W2" },
  { imageUrl: "https://randomuser.me/api/portraits/men/3.jpg", fallback: "M3" },
  { imageUrl: "https://randomuser.me/api/portraits/women/3.jpg", fallback: "W3" },
];

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    if (socket.connected) {
      onConnect();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("buttonState", (state) => {
      setButtonState(state); // Listen for button state changes from the server
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("buttonState"); // Clean up the button state listener
    };
  }, []);

  const openRegister = () => setIsRegisterOpen(true);
  const closeRegister = () => setIsRegisterOpen(false);

  const toggleButton = () => {
    const newState = !buttonState;
    setButtonState(newState);
    socket.emit("buttonPress", newState); // Emit button state changes to the server
  };

  return (
    <div className="flex h-screen flex-col lg:flex-row relative">
      <Navbar />
      <div className="flex-1 ml-16">
        <Header
          user={user}
          isSignedIn={isSignedIn}
          imageUrl={imageUrl}
          onOpenRegister={openRegister}
          members={members} // Pass the members array to Header component
        />
        <div className="flex flex-col lg:flex-row-reverse lg:h-screen space-y-2 lg:space-y-0 lg:space-x-2 mr-2">
          <div className="flex flex-col rounded-lg p-1 w-full lg:w-full lg:flex-1 border-r border-gray-1">
            <CodeEditor /> 
          </div>
          <div className="p-2 rounded-lg xl:w-1/3 lg:w-1/3 md:w-1/2 border-r-color">
            <h3 className="text-xl font-semibold mb-2">Chat</h3>
            <p className="text-gray-700">Here Goes the Chat</p>
          </div>
        </div>
      </div>
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Register
            onClose={closeRegister}
            setIsSignedIn={setIsSignedIn}
            setUsername={setUser}
          />
          <button
            onClick={closeRegister}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md"
          >
            x
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
