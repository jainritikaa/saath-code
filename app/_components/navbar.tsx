"use client";
import React, { useState } from "react";
import Image from 'next/image';

// Import images
import houseImage from '@/images/home.png';
import bookImage from  '@/images/page.png';
import tagImage from  '@/images/tag.png';
import chatImage from  '@/images/chat.png';
import settingImage from  '@/images/setting.png';
import logoImage from '@/images/hindi.png'
import logoutImage from '@/images/logout.png';

// Define the possible tab names
type TabName = 'home' | 'tag' | 'settings' | 'book' | 'chat' | 'logout';

export const Navbar = () => {
    // State to keep track of the active tab
    const [activeTab, setActiveTab] = useState<TabName>('home');

    // Function to handle tab click
    const handleTabClick = (tabName: TabName) => {
        setActiveTab(tabName);
    };

    return (
        <div className="fixed left-0 top-0 h-full w-sm flex flex-col items-center justify-between bg-background border-r-color ">
            <div className="p-4">
                <Image src={logoImage} alt="Home" width={31} height={2} />
            </div>
            <div className="p-1">
                <ul className="flex items-center flex-col space-y-3">
                    <li 
                        className={`custom-hover-effect p-2 ${activeTab === 'home' ? 'active-tab' : ''}`}
                        onClick={() => handleTabClick('home')}
                    >
                        <Image src={houseImage} alt="Home" width={21} height={21} />
                    </li>
                    <li 
                        className={`custom-hover-effect p-2 ${activeTab === 'tag' ? 'active-tab' : ''}`}
                        onClick={() => handleTabClick('tag')}
                    >
                        <Image src={tagImage} alt="Tag" width={17} height={22} />
                    </li>
                    <li 
                        className={`custom-hover-effect p-2 ${activeTab === 'settings' ? 'active-tab' : ''}`}
                        onClick={() => handleTabClick('settings')}
                    >
                        <Image src={settingImage} alt="Settings" width={19} height={22} />
                    </li>
                    <li 
                        className={`custom-hover-effect p-2 ${activeTab === 'book' ? 'active-tab' : ''}`}
                        onClick={() => handleTabClick('book')}
                    >
                        <Image src={bookImage} alt="Book" width={21} height={25} />
                    </li>
                    <li 
                        className={`custom-hover-effect p-2 ${activeTab === 'chat' ? 'active-tab' : ''}`}
                        onClick={() => handleTabClick('chat')}
                    >
                        <Image src={chatImage} alt="Chat" width={20} height={22} />
                    </li>
                </ul>
            </div>
            <div>
                <ul>
                    <li 
                        className={`custom-hover-effect p-2 ${activeTab === 'logout' ? 'active-tab' : ''}`}
                        onClick={() => handleTabClick('logout')}
                    >
                        <Image src={logoutImage} alt="Logout" width={18} height={22} />
                    </li>
                </ul>
            </div>
        </div>
    );
};
