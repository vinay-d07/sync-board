import { useCanvasContext } from "../context/CanvasContext";
import { pencilTool } from "../utils/drawtools/PencilTool";
import { useRef, useEffect } from "react";

import { rectTool } from "../utils/drawtools/Rectangle";
import { circleTool } from "../utils/drawtools/Circle";
import { lineTool } from "../utils/drawtools/LineTool";
import { rhombusTool } from "../utils/drawtools/rhombus";
import { SelectTool } from "../utils/drawtools/SelectTool";
import { drawSelectionBoundaries, getHandleAtPoint, getCursorForHandle } from "../utils/selectionBoundaries";
import { getShapeAtPoint } from "../utils/getShapeAtpoint";

export const useCanvas = (canvasRef) => {
    const {
        isDrawing,
        setCurrPos,
        setIsDrawing,
        tool,
        setShapes,
        shapes,
        selectedShapeIds,
        setSelectedShapes,
        style,
        selection,
        setSelectionStart,
        setSelectionEnd,
        clearSelection,
        drag,
        startDrag,
        endDrag,
        updateShapes,

    } = useCanvasContext();

    const currentPath = useRef([]);
    const drawingStartPos = useRef(null);


    const ToolMap = {
        cursor: SelectTool,
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

    const updateCursor = (pos) => {
        if (!canvasRef.current) return;

        // Check if hovering over a resize handle
        if (selectedShapeIds.length > 0) {
            const handleType = getHandleAtPoint(pos, selectedShapeIds, shapes);
            if (handleType) {
                canvasRef.current.style.cursor = getCursorForHandle(handleType);
                return;
            }
        }

        // Check if hovering over a shape
        const shape = getShapeAtPoint(pos, shapes);
        if (shape && selectedShapeIds.includes(shape.id)) {
            canvasRef.current.style.cursor = 'move';
        } else if (shape) {
            canvasRef.current.style.cursor = 'pointer';
        } else {
            canvasRef.current.style.cursor = 'default';
        }
    };

    const getToolState = () => ({
        shapes,
        setShapes,
        selectedShapeIds,
        setSelectedShapes,
        currentPath,
        startPos: drawingStartPos,
        currentPos: currentPosRef,
        selection,
        setSelectionStart,
        setSelectionEnd,
        clearSelection,
        drag,
        startDrag,
        endDrag,
        updateShapes,
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

        activeToolFn?.onMouseDown(ctx, pos, state, e);

        if (tool !== "pencil") {
            drawingStartPos.current = pos;
        }

        setIsDrawing(true);
        setCurrPos(pos);
    };


    const onMouseMove = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const pos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        currentPosRef.current = pos;

        // Update cursor for select tool
        if (tool === 'select' || tool === 'cursor') {
            updateCursor(pos);
        }

        if (!isDrawing || !ctx) return;

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

        activeToolFn?.onMouseUp(ctx, pos, state, e);


        const shape = activeToolFn?.createShape?.(state);

        if (shape) {
            console.log('Creating shape:', shape);
            setShapes(shape);
        }


        currentPath.current.length = 0;
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
            if (tool === 'select' || tool === 'cursor') {
                activeToolFn.drawPreview(ctx, getToolState());
            } else if (tool === 'rectangle' || tool === 'circle' || tool === 'line' || tool === 'rhombus') {
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

        // Draw selection boundaries like Excalidraw
        drawSelectionBoundaries(ctx, selectedShapeIds, shapes);

        if (typeof renderSelections === "function") {
            renderSelections(ctx, shapes, selectedShapeIds);
        }
    };


    useEffect(() => {
        console.log("selected :", selectedShapeIds)
    }, [selectedShapeIds])
    useEffect(() => {
        redrawCanvas();
    }, [shapes, selection, selectedShapeIds, drag]);

    return {
        onMouseDown,
        onMouseMove,
        onMouseUp
    };
};