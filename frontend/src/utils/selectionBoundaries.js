import { getSelectionBounds } from "./getShapeAtpoint";

const HANDLE_SIZE = 8;
const HANDLE_COLOR = '#2563eb';
const BORDER_COLOR = '#2563eb';
const BORDER_WIDTH = 2;
const DASH_PATTERN = [5, 3];

export function drawSelectionBoundaries(ctx, selectedShapeIds, shapes) {
    if (!selectedShapeIds || selectedShapeIds.length === 0) return;

    const bounds = getSelectionBounds(selectedShapeIds, shapes);
    if (!bounds) return;

    const { x, y, width, height } = bounds;

    // Save context state
    const originalAlpha = ctx.globalAlpha;
    const originalStrokeStyle = ctx.strokeStyle;
    const originalFillStyle = ctx.fillStyle;
    const originalLineWidth = ctx.lineWidth;

    // Draw selection border
    ctx.strokeStyle = BORDER_COLOR;
    ctx.lineWidth = BORDER_WIDTH;
    ctx.globalAlpha = 1;
    ctx.setLineDash(DASH_PATTERN);
    
    ctx.strokeRect(x, y, width, height);
    
    // Reset line dash for handles
    ctx.setLineDash([]);

    // Draw resize handles
    const handles = getResizeHandles(x, y, width, height);
    
    ctx.fillStyle = HANDLE_COLOR;
    ctx.globalAlpha = 0.8;
    
    for (const handle of handles) {
        drawHandle(ctx, handle);
    }

    // Restore context state
    ctx.globalAlpha = originalAlpha;
    ctx.strokeStyle = originalStrokeStyle;
    ctx.fillStyle = originalFillStyle;
    ctx.lineWidth = originalLineWidth;
    ctx.setLineDash([]);
}

function getResizeHandles(x, y, width, height) {
    const handles = [];
    const halfSize = HANDLE_SIZE / 2;

    // Corner handles
    handles.push(
        { x: x - halfSize, y: y - halfSize, type: 'nw' }, // top-left
        { x: x + width - halfSize, y: y - halfSize, type: 'ne' }, // top-right
        { x: x - halfSize, y: y + height - halfSize, type: 'sw' }, // bottom-left
        { x: x + width - halfSize, y: y + height - halfSize, type: 'se' } // bottom-right
    );

    // Edge handles (only show for larger selections)
    if (width > 40) {
        handles.push(
            { x: x + width / 2 - halfSize, y: y - halfSize, type: 'n' }, // top
            { x: x + width / 2 - halfSize, y: y + height - halfSize, type: 's' } // bottom
        );
    }

    if (height > 40) {
        handles.push(
            { x: x - halfSize, y: y + height / 2 - halfSize, type: 'w' }, // left
            { x: x + width - halfSize, y: y + height / 2 - halfSize, type: 'e' } // right
        );
    }

    return handles;
}

function drawHandle(ctx, handle) {
    const { x, y } = handle;
    
    // Draw handle background
    ctx.fillRect(x, y, HANDLE_SIZE, HANDLE_SIZE);
    
    // Draw handle border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, HANDLE_SIZE, HANDLE_SIZE);
    
    // Restore stroke style
    ctx.strokeStyle = HANDLE_COLOR;
    ctx.lineWidth = 1;
}

export function getHandleAtPoint(point, selectedShapeIds, shapes) {
    if (!selectedShapeIds || selectedShapeIds.length === 0) return null;

    const bounds = getSelectionBounds(selectedShapeIds, shapes);
    if (!bounds) return null;

    const { x, y, width, height } = bounds;
    const handles = getResizeHandles(x, y, width, height);

    for (const handle of handles) {
        if (isPointInHandle(point, handle)) {
            return handle.type;
        }
    }

    return null;
}

function isPointInHandle(point, handle) {
    return point.x >= handle.x && 
           point.x <= handle.x + HANDLE_SIZE &&
           point.y >= handle.y && 
           point.y <= handle.y + HANDLE_SIZE;
}

export function getCursorForHandle(handleType) {
    switch (handleType) {
        case 'nw':
        case 'se':
            return 'nwse-resize';
        case 'ne':
        case 'sw':
            return 'nesw-resize';
        case 'n':
        case 's':
            return 'ns-resize';
        case 'w':
        case 'e':
            return 'ew-resize';
        default:
            return 'move';
    }
}
