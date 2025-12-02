import React from "react";
import { Circle, Text, Group } from "react-konva";

const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
};

const UserCursor = ({ cursor }) => {
  const color = stringToColor(cursor.username || "Anon");   

  return (
    <Group x={cursor.x} y={cursor.y}>
      <Circle radius={5} fill={color} />
      <Text
        text={cursor.username}
        fontSize={12}
        fill="black"
        x={10}
        y={-5}
        padding={4}
        listening={false}
      />
    </Group>
  );
};

export default UserCursor;