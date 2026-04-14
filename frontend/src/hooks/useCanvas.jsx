import { draw } from "../utils/draw";
import { useCanvasContext } from "../context/CanvasContext"

export const useCanvas = (canvasRef) => {
    const { isDrawing, currPos, setCurrPos, setIsDrawing, setLastPos } = useCanvasContext();

    const ctx = canvasRef?.current?.getContext("2d");
    const onMouseDown = (e) => {
        const pos = {
            x: e.clientX,
            y: e.clientY
        }
        ctx?.beginPath();
        ctx?.moveTo(pos.x, pos.y);
        setIsDrawing(true);
        setCurrPos(pos)
    }

    const onMouseUp = (e) => {
        const pos = {
            x: e.clientX,
            y: e.clientY
        }
        setLastPos(pos)
        setIsDrawing(false)
    }

    const onMouseMove = (e) => {
        if (!isDrawing || !ctx) return;
        const pos = {
            x: e.clientX,
            y: e.clientY
        }
        draw(ctx, currPos)
        setCurrPos(pos)
    }

    return { onMouseDown, onMouseUp, onMouseMove };
}