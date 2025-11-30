export const updateStrategies = {
  rect: (startPos, currentPos) => {
    return {
      width: currentPos.x - startPos.x,
      height: currentPos.y - startPos.y,
    };
  },

  ellipse: (startPos, currentPos) => {
    return {
      // Midpoint Formula: (x1 + x2) / 2
      x: (startPos.x + currentPos.x) / 2,
      y: (startPos.y + currentPos.y) / 2,

      // Radius is half the distance
      radiusX: Math.abs(currentPos.x - startPos.x) / 2,
      radiusY: Math.abs(currentPos.y - startPos.y) / 2,
    };
  },

  line: (startPos, currentPos, existingPoints) => {
    // Safely grab existing points or default to empty array
    const points = existingPoints || [];
    return {
      points: [...points, currentPos.x, currentPos.y],
    };
  },

  arrow: (startPos, currentPos, existingPoints) => {
    const newPoints = [...existingPoints]; // Copy it first
    newPoints[2] = currentPos.x;
    newPoints[3] = currentPos.y;
    return { points: newPoints };
  },

  straightLine: (startPos, currentPos, existingPoints) => {
    const newPoints = [...existingPoints]; // Copy it first
    newPoints[2] = currentPos.x;
    newPoints[3] = currentPos.y;
    return { points: newPoints };
  },
};
