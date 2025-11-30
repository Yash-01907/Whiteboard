import React from 'react'   
import { Arrow } from 'react-konva'

function ArrowComponent({
    commonProps,
    shape,
    key
}) {
   return (
          <Arrow
          key={key}
            {...commonProps}
            points={shape.points}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
            fill={shape.fill}
            pointerLength={10}
            pointerWidth={10}
          />
        );
}

export default ArrowComponent