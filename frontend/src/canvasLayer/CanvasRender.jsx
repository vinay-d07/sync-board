import React from 'react'

export const CanvasRender = ({ onMouseUp, onMouseDown, onMouseMove, canvasRef }) => {
    return (


        <canvas
            ref={canvasRef}
            height={900}
            width={1300}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            style={{ border: "2px solid black" }}
        />

    )
}
