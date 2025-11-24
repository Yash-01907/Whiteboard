import React, { useState } from "react";
import { Toolbar } from "../components/Toolbar";
import Whiteboard from "../components/Whiteboard";

const WhiteboardWrapper = () => {
  const [tool, setTool] = useState("rect");
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      
      {/* 2. Pass the "Setter" to the Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <Toolbar 
           activeTool={tool} 
           onToolChange={(tool) => setTool(tool)} 
        />
      </div>

      {/* 3. Pass the "Value" to the Whiteboard */}
      <Whiteboard tool={tool} />
      
    </div>
  );
};

export default WhiteboardWrapper;
