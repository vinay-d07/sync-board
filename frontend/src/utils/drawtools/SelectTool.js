import { getShapeAtPoint, getShapesInRectangle, getSelectionBounds } from "../getShapeAtpoint";
import { getHandleAtPoint, getCursorForHandle } from "../selectionBoundaries";
import { moveShapes, resizeShapes } from "../shapeTransforms";

function calculateNewBounds(originalBounds, handleType, startPos, currentPos) {
    if (!originalBounds) return null;
    
    const deltaX = currentPos.x - startPos.x;
    const deltaY = currentPos.y - startPos.y;
    
    let newX = originalBounds.x;
    let newY = originalBounds.y;
    let newWidth = originalBounds.width;
    let newHeight = originalBounds.height;
    
    switch (handleType) {
        case 'nw': // top-left
            newX = originalBounds.x + deltaX;
            newY = originalBounds.y + deltaY;
            newWidth = originalBounds.width - deltaX;
            newHeight = originalBounds.height - deltaY;
            break;
        case 'ne': // top-right
            newY = originalBounds.y + deltaY;
            newWidth = originalBounds.width + deltaX;
            newHeight = originalBounds.height - deltaY;
            break;
        case 'sw': // bottom-left
            newX = originalBounds.x + deltaX;
            newWidth = originalBounds.width - deltaX;
            newHeight = originalBounds.height + deltaY;
            break;
        case 'se': // bottom-right
            newWidth = originalBounds.width + deltaX;
            newHeight = originalBounds.height + deltaY;
            break;
        case 'n': // top
            newY = originalBounds.y + deltaY;
            newHeight = originalBounds.height - deltaY;
            break;
        case 's': // bottom
            newHeight = originalBounds.height + deltaY;
            break;
        case 'w': // left
            newX = originalBounds.x + deltaX;
            newWidth = originalBounds.width - deltaX;
            break;
        case 'e': // right
            newWidth = originalBounds.width + deltaX;
            break;
    }
    
    // Ensure minimum size
    if (newWidth < 10) newWidth = 10;
    if (newHeight < 10) newHeight = 10;
    
    return {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
    };
}

export const SelectTool = {
    onMouseDown(ctx, pos, state, event) {
        const { 
            shapes, 
            selectedShapeIds, 
            setSelectedShapes, 
            setSelectionStart, 
            setSelectionEnd, 
            clearSelection,
            drag,
            startDrag,
            endDrag,
            updateShapes
        } = state;
        
        const isMultiSelect = event?.shiftKey || event?.ctrlKey || event?.metaKey;

        // Check if clicking on a resize handle
        if (selectedShapeIds.length > 0) {
            const handleType = getHandleAtPoint(pos, selectedShapeIds, shapes);
            if (handleType) {
                const bounds = getSelectionBounds(selectedShapeIds, shapes);
                startDrag({
                    dragType: 'resize',
                    handleType,
                    startPos: pos,
                    originalBounds: bounds,
                    originalShapes: shapes.filter(s => selectedShapeIds.includes(s.id))
                });
                return;
            }
        }

        // Check if clicking on a shape
        const shape = getShapeAtPoint(pos, shapes);

        if (shape) {
            if (selectedShapeIds.includes(shape.id)) {
                // Start moving selected shapes
                if (!isMultiSelect) {
                    startDrag({
                        dragType: 'move',
                        handleType: null,
                        startPos: pos,
                        originalBounds: null,
                        originalShapes: shapes.filter(s => selectedShapeIds.includes(s.id))
                    });
                } else {
                    // Multi-select toggle
                    setSelectedShapes(
                        selectedShapeIds.filter(id => id !== shape.id)
                    );
                }
            } else {
                // Select new shape(s)
                if (isMultiSelect) {
                    setSelectedShapes([...selectedShapeIds, shape.id]);
                } else {
                    setSelectedShapes([shape.id]);
                }
                clearSelection();
            }
        } else {
            // Start selection rectangle
            if (!isMultiSelect) {
                setSelectedShapes([]);
            }
            setSelectionStart(pos);
            setSelectionEnd(pos);
        }
    },

    onMouseMove(ctx, pos, state) {
        const { 
            shapes, 
            selectedShapeIds, 
            selection, 
            setSelectionEnd,
            drag,
            startDrag,
            updateShapes
        } = state;

        // Handle drag operations
        if (drag.isDragging) {
            if (drag.dragType === 'move') {
                const deltaX = pos.x - drag.startPos.x;
                const deltaY = pos.y - drag.startPos.y;
                console.log('Dragging shapes:', selectedShapeIds, 'delta:', deltaX, deltaY);
                console.log('Original shapes:', drag.originalShapes);
                // Always use original shapes as reference to prevent cumulative movement
                const movedShapes = moveShapes(selectedShapeIds, drag.originalShapes, deltaX, deltaY);
                console.log('Moved shapes:', movedShapes);
                // Merge moved shapes with unchanged shapes
                const updatedShapes = shapes.map(shape => {
                    const movedShape = movedShapes.find(s => s.id === shape.id);
                    return movedShape || shape;
                });
                updateShapes(updatedShapes);
            } else if (drag.dragType === 'resize') {
                const newBounds = calculateNewBounds(drag.originalBounds, drag.handleType, drag.startPos, pos);
                // Always use original shapes as reference for resize
                const resizedShapes = resizeShapes(selectedShapeIds, drag.originalShapes, drag.handleType, drag.originalBounds, newBounds);
                // Merge resized shapes with unchanged shapes
                const updatedShapes = shapes.map(shape => {
                    const resizedShape = resizedShapes.find(s => s.id === shape.id);
                    return resizedShape || shape;
                });
                updateShapes(updatedShapes);
            }
        } else if (selection.start && selection.end) {
            // Update selection rectangle
            setSelectionEnd(pos);
        }
    },

    onMouseUp(ctx, pos, state, event) {
        const { 
            shapes, 
            selectedShapeIds, 
            setSelectedShapes, 
            selection, 
            clearSelection,
            drag,
            endDrag
        } = state;
        
        const isMultiSelect = event?.shiftKey || event?.ctrlKey || event?.metaKey;

        // End drag operation
        if (drag.isDragging) {
            endDrag();
            return;
        }

        // Handle selection rectangle
        if (selection.start && selection.end) {
            const shapesInSelection = getShapesInRectangle(selection.start, selection.end, shapes);

            if (shapesInSelection.length > 0) {
                if (isMultiSelect) {
                    const newSelection = [...new Set([...selectedShapeIds, ...shapesInSelection])];
                    setSelectedShapes(newSelection);
                } else {
                    setSelectedShapes(shapesInSelection);
                }
            } else if (!isMultiSelect) {
                setSelectedShapes([]);
            }
        }

        clearSelection();
    },

    draw(ctx, shape) {
        const { startPos, endPos } = shape;
        if (!startPos || !endPos) return;

        const startX = Math.min(startPos.x, endPos.x);
        const startY = Math.min(startPos.y, endPos.y);
        const width = Math.abs(endPos.x - startPos.x);
        const height = Math.abs(endPos.y - startPos.y);

        const originalAlpha = ctx.globalAlpha;
        const originalStrokeStyle = ctx.strokeStyle;

        ctx.strokeStyle = '#004780';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;

        ctx.strokeRect(startX, startY, width, height);

        ctx.globalAlpha = originalAlpha;
        ctx.strokeStyle = originalStrokeStyle;
    },

    drawPreview(ctx, state) {
        const { selection } = state;
        if (!selection.start || !selection.end) return;

        const startX = Math.min(selection.start.x, selection.end.x);
        const startY = Math.min(selection.start.y, selection.end.y);
        const width = Math.abs(selection.end.x - selection.start.x);
        const height = Math.abs(selection.end.y - selection.start.y);

        const originalAlpha = ctx.globalAlpha;
        const originalFillStyle = ctx.fillStyle;
        const originalStrokeStyle = ctx.strokeStyle;

        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        ctx.fillStyle = "#3b82f6";
        ctx.globalAlpha = 0.2;

        ctx.fillRect(startX, startY, width, height);
        ctx.strokeRect(startX, startY, width, height);

        ctx.globalAlpha = originalAlpha;
        ctx.fillStyle = originalFillStyle;
        ctx.strokeStyle = originalStrokeStyle;
    }
};