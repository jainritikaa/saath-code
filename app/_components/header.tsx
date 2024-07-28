"use client";
import React from "react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  user: string;
  isSignedIn: boolean;
  imageUrl?: string;
  onOpenRegister: () => void;
  members: Array<{ imageUrl: string; fallback: string }>;
}

export const Header: React.FC<HeaderProps> = ({ user, isSignedIn, imageUrl, onOpenRegister, members }) => {
  return (
    <div className="flex items-center justify-between mt-1 mb-2 px-5 py-2 sticky top-0 z-10 border-b border-gray-300">
      {/* Input on the left with adjusted width */}
      <div className="flex flex-col flex-wrap items-left">
        <h1 className="text-2xl font-bold">Hello, <span>{user}</span></h1>
        <p className="text-slate-600 text-sm">Code with friends, assign tasks, discuss and much more.</p>
      </div>

      {/* Avatar, username, and possibly a button on the right */}
      <div className="flex items-center space-x-4">
        <div className="flex -space-x-2">
          {members.map((member, index) => (
            <div key={index} className="relative">
              <img
                src={member.imageUrl}
                alt={member.fallback}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            </div>
          ))}
        </div>
        {isSignedIn ? (
          <Button
            className="bg-lightblue-100 text-blue-600 rounded-lg"
          >
            Contribute!
          </Button>
        ) : (
          <Button
            onClick={onOpenRegister}
            className="bg-blue-50 text-blue-600 rounded-lg"
          >
            Join the Community
          </Button>
        )}
      </div>
    </div>
  );
};
