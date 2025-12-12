  // import React from "react";
  // import { Text } from "react-konva";
  // function TextComponent({
  //     commonProps,
  //     shape,
  //     key,
  //     handleTextDblClick,
  //     editingText,
  // }) {
  //   return (
  //     // <Text
  //     // key={key}
  //     //   {...commonProps}
  //     //   x={shape.x}
  //     //   y={shape.y}
  //     //   text={shape.text}
  //     //   fontSize={shape.fontSize}
  //     //   fill={shape.fill}
  //     // />

  //     <Text
  //             {...commonProps}
  //             x={shape.x}
  //             y={shape.y}
  //             text={shape.text}
  //             fontSize={shape.fontSize}
  //             fill={shape.fill}
  //             // Add Double Click Listener
  //             onDblClick={(e) => handleTextDblClick(e, shape.id, shape.text)}
  //             onDblTap={(e) => handleTextDblClick(e, shape.id, shape.text)}
  //             // Hide the text node while editing so it doesn't overlap
  //             visible={editingText?.id !== shape.id} 
  //           />
  //   );
  // }

  // export default TextComponent;


import React from "react";
import { Text } from "react-konva";

function TextComponent({
  commonProps,
  shape,
  handleTextDblClick,
  editingText,
}) {
  return (
    <Text
      // 1. Auto-pass EVERYTHING from the shape (x, y, rotation, scaleX, scaleY...)
      {...shape}
      
      stroke={null}
      // 2. Pass the Logic (draggable, onClick, onDragEnd...)
      {...commonProps}
      
      // 3. Manual Overrides
      onDblClick={(e) => handleTextDblClick(e, shape.id, shape.text)}
      onDblTap={(e) => handleTextDblClick(e, shape.id, shape.text)}
      visible={editingText?.id !== shape.id}
    />
  );
}

export default TextComponent;