import React, { useState, useRef } from "react";

const Terminal = () => {
  const [activeTab, setActiveTab] = useState("terminal");
  const [height, setHeight] = useState(250); // Initial height
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const isResizingRef = useRef(false);

  const tabs = [
    { name: "Terminal", value: "terminal" },
    { name: "Output", value: "output" },
    { name: "Problems", value: "problems" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "terminal":
        return (
          <div className="p-4 h-full overflow-y-auto bg-gray-100">
            <p>Welcome to the terminal!</p>
            {/* Add your terminal functionality here */}
          </div>
        );
      case "output":
        return (
          <div className="p-4 h-full overflow-y-auto bg-gray-100">
            <p>Your output will be displayed here.</p>
            {/* Add your output display here */}
          </div>
        );
      case "problems":
        return (
          <div className="p-4 h-full overflow-y-auto bg-gray-100">
            <p>List of problems will be displayed here.</p>
            {/* Add your problem list here */}
          </div>
        );
      default:
        return null;
    }
  };

  const startResizing = (e: React.MouseEvent) => {
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResizing);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizingRef.current && terminalRef.current) {
      const newHeight =
        height - (e.clientY - terminalRef.current.getBoundingClientRect().top);
      if (newHeight > 100) {
        // Set a minimum height
        setHeight(newHeight);
      }
    }
  };

  const stopResizing = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResizing);
  };

  return (
    <div ref={terminalRef} className="w-full" style={{ height: `${height}px` }}>
      <div className="flex  justify-left border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`
                rounded-lg 
                p-2 
                text-left 
                inline-flex 
                items-center 
                justify-center
                 whitespace-nowrap 
                 text-sm 
                 font-medium 
                 transition-colors 
                 focus-visible:outline-none 
                 focus-visible:ring-1 
                 focus-visible:ring-ring 
                 disabled:pointer-events-none 
                 disabled:opacity-50 shadow 
                 hover:bg-primary/90 
                 h-9 px-4 py-2 
                 bg-blue-50 
                 text-blue-600 
                 rounded-lg"> ${
              activeTab === tab.value
                ? "bg-blue-50 text-black font-semibold"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className="h-full">{renderContent()}</div>
      <div
        className="w-full h-1 bg-blue-50
         cursor-n-resize"
        onMouseDown={startResizing}
      ></div>
    </div>
  );
};

export default Terminal;
