import React from 'react'   
import { Arrow } from 'react-konva'

function ArrowComponent({
    commonProps,
    shape,
    key,
    onDragEnd,
    onTransformEnd,
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
            onDragEnd={onDragEnd}
            onTransformEnd={onTransformEnd}
          />
        );
}

export default ArrowComponent