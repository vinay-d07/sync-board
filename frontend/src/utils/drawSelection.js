export function drawSelection(ctx, shape) {
    if (!shape) return;

    ctx.save();
    ctx.strokeStyle = '#3b82f6'; // Blue color for selection
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]); // Dashed lines for selection

    switch (shape.type) {
        case 'rect':
            drawRectSelection(ctx, shape);
            break;
        case 'circle':
            drawCircleSelection(ctx, shape);
            break;
        case 'line':
            drawLineSelection(ctx, shape);
            break;
        case 'pencil':
            drawPencilSelection(ctx, shape);
            break;
        default:
            break;
    }

    ctx.restore();
}

function drawRectSelection(ctx, shape) {
    const padding = 5;
    ctx.strokeRect(
        shape.x - padding,
        shape.y - padding,
        shape.width + padding * 2,
        shape.height + padding * 2
    );
    
    // Draw resize handles
    drawResizeHandles(ctx, shape.x, shape.y, shape.width, shape.height);
}

function drawCircleSelection(ctx, shape) {
    const padding = 5;
    ctx.beginPath();
    ctx.arc(shape.cx, shape.cy, shape.radius + padding, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw resize handles
    drawCircleResizeHandles(ctx, shape.cx, shape.cy, shape.radius);
}

function drawLineSelection(ctx, shape) {
    const padding = 5;
    
    // Draw selection box around the line
    const minX = Math.min(shape.startPos.x, shape.endPos.x) - padding;
    const minY = Math.min(shape.startPos.y, shape.endPos.y) - padding;
    const maxX = Math.max(shape.startPos.x, shape.endPos.x) + padding;
    const maxY = Math.max(shape.startPos.y, shape.endPos.y) + padding;
    
    ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
    
    // Draw handles at line endpoints
    drawHandle(ctx, shape.startPos.x, shape.startPos.y);
    drawHandle(ctx, shape.endPos.x, shape.endPos.y);
}

function drawPencilSelection(ctx, shape) {
    if (!shape.path || shape.path.length === 0) return;
    
    // Find bounds of the pencil path
    let minX = shape.path[0].x, maxX = shape.path[0].x;
    let minY = shape.path[0].y, maxY = shape.path[0].y;
    
    shape.path.forEach(point => {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
    });
    
    const padding = 5;
    ctx.strokeRect(minX - padding, minY - padding, maxX - minX + padding * 2, maxY - minY + padding * 2);
}

function drawResizeHandles(ctx, x, y, width, height) {
    const handleSize = 8;
    
    // Corner handles
    drawHandle(ctx, x, y);
    drawHandle(ctx, x + width, y);
    drawHandle(ctx, x, y + height);
    drawHandle(ctx, x + width, y + height);
    
    // Edge handles
    drawHandle(ctx, x + width / 2, y);
    drawHandle(ctx, x + width / 2, y + height);
    drawHandle(ctx, x, y + height / 2);
    drawHandle(ctx, x + width, y + height / 2);
}

function drawCircleResizeHandles(ctx, cx, cy, radius) {
    // Cardinal points
    drawHandle(ctx, cx + radius, cy);
    drawHandle(ctx, cx - radius, cy);
    drawHandle(ctx, cx, cy + radius);
    drawHandle(ctx, cx, cy - radius);
}

function drawHandle(ctx, x, y) {
    const handleSize = 8;
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.strokeRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
}
