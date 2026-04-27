import { useCanvasContext } from "../context/CanvasContext";
import { pencilTool } from "../utils/drawtools/PencilTool";
import { useRef, useEffect } from "react";
import { SelectTool } from "../utils/drawtools/SelectTool";
import { rectTool } from "../utils/drawtools/Rectangle";
import { circleTool } from "../utils/drawtools/Circle";
import { lineTool } from "../utils/drawtools/LineTool";
import { rhombusTool } from "../utils/drawtools/rhombus";

export const useCanvas = (canvasRef) => {
    const {
        isDrawing,
        currPos,
        setCurrPos,
        setIsDrawing,
        tool,
        setShapes,
        shapes,
        selectedShapeIds,
        setSelectedShapes,
        style,
        updateStyle
    } = useCanvasContext();

    const currentPath = useRef([]);
    const drawingStartPos = useRef(null);

    const ToolMap = {
        pencil: pencilTool,
        select: SelectTool,
        rectangle: rectTool,
        circle: circleTool,
        line: lineTool,
        rhombus: rhombusTool,
    };

    const activeToolFn = ToolMap[tool];

    const ctx = canvasRef?.current?.getContext("2d");

    const currentPosRef = useRef(null);

    const getToolState = () => ({
        shapes,
        setShapes,
        selectedShapeIds,
        setSelectedShapes,
        currentPath,
        startPos: drawingStartPos,
        currentPos: currentPosRef,
        strokeStyle: style.strokeColor,
        lineWidth: style.strokeWidth,
        fillColor: style.fillColor,
        opacity: style.opacity
    });


    const onMouseDown = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const pos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        const state = getToolState();

        activeToolFn?.onMouseDown(ctx, pos, state);

        if (tool !== "pencil") {
            drawingStartPos.current = pos;
        }

        setIsDrawing(true);
        setCurrPos(pos);
    };


    const onMouseMove = (e) => {
        if (!isDrawing || !ctx) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const pos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        currentPosRef.current = pos;

        const state = getToolState();
        redrawCanvas()
        activeToolFn?.onMouseMove(ctx, pos, state)
        setCurrPos(pos);
    };


    const onMouseUp = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const pos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        const state = getToolState();

        activeToolFn?.onMouseUp(ctx, pos, state);


        const shape = activeToolFn?.createShape?.(state);

        if (shape) {
            setShapes(shape);
        }


        currentPath.current.length = 0;;
        drawingStartPos.current = null;

        setIsDrawing(false);
    };


    const redrawCanvas = () => {
        if (!ctx || !canvasRef.current) return;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);


        shapes.forEach((shape) => {
            const tool = ToolMap[shape.type];

            tool?.draw(ctx, shape);
        });


        if (isDrawing && activeToolFn?.drawPreview) {
            if (tool === 'rectangle' || tool === 'circle' || tool === 'line' || tool === 'rhombus') {

                activeToolFn.drawPreview(ctx, drawingStartPos.current, currentPosRef.current, style);
            } else {

                activeToolFn.drawPreview(ctx, {
                    currentPath: currentPath,
                    startPos: drawingStartPos,
                    currentPos: currentPosRef,
                    strokeStyle: style.strokeColor,
                    lineWidth: style.strokeWidth,
                    fillColor: style.fillColor,
                    opacity: style.opacity
                });
            }
        }


        if (typeof renderSelections === "function") {
            renderSelections(ctx, shapes, selectedShapeIds);
        }
    };

    // Redraw canvas when shapes change
    useEffect(() => {
        console.log("SHAPES", shapes)
        redrawCanvas();
    }, [shapes]);

    // Redraw canvas for preview when drawing
    useEffect(() => {
        if (isDrawing) {
            redrawCanvas();
        }
    }, [currPos, isDrawing]);

    useEffect(() => {
        console.log(activeToolFn);
    }, [tool]);

    return {
        onMouseDown,
        onMouseMove,
        onMouseUp
    };
};