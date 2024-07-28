import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MemberAvatarsProps {
  members: { imageUrl?: string; fallback?: string }[];
}

const MemberAvatars: React.FC<MemberAvatarsProps> = ({ members }) => {
  return (
    <div className="flex  -space-x-3">
      {members.map((member, index) => (
        <Avatar key={index} className="border-2 border-white">
          <AvatarImage src={member.imageUrl} />
          <AvatarFallback>{member.fallback}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
};

export default MemberAvatars;
