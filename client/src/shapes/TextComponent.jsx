import React from "react";
import { Text } from "react-konva";
function TextComponent({
    commonProps,
    shape,
    key
}) {
  return (
    <Text
    key={key}
      {...commonProps}
      x={shape.x}
      y={shape.y}
      text={shape.text}
      fontSize={shape.fontSize}
      fill={shape.fill}
    />
  );
}

export default TextComponent;
