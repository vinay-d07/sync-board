export const rhombusTool = {
    onMouseDown(ctx, pos, state) {
        // Rhombus tool doesn't need to modify state on mouse down
        // The useCanvas hook handles setting startPos
    },

    onMouseMove(ctx, pos, state) {
        // Rhombus tool doesn't need to modify state on mouse move
        // The useCanvas hook handles real-time drawing
    },

    onMouseUp(ctx, pos, state) {
        // Rhombus tool doesn't need to modify state on mouse up
        // The useCanvas hook handles shape creation
    },

    createShape(state) {
        const start = state.startPos.current;
        const end = state.currentPos.current;

        if (!start || !end) return null;

        return {
            id: Date.now().toString(),
            type: 'rhombus',
            startPos: start,
            endPos: end,
            strokeStyle: state.strokeStyle,
            lineWidth: state.lineWidth,
        };
    },

    draw(ctx, shape) {
        if (!shape.startPos || !shape.endPos) return;
        
        ctx.strokeStyle = shape.strokeStyle || '#000';
        ctx.lineWidth = shape.lineWidth || 2;
        
        const centerX = (shape.startPos.x + shape.endPos.x) / 2;
        const centerY = (shape.startPos.y + shape.endPos.y) / 2;
        
        ctx.beginPath();
        ctx.moveTo(centerX, shape.startPos.y);
        ctx.lineTo(shape.endPos.x, centerY);
        ctx.lineTo(centerX, shape.endPos.y);
        ctx.lineTo(shape.startPos.x, centerY);
        ctx.closePath();
        ctx.stroke();
    },

    drawPreview(ctx, startPos, currentPos, style) {
        if (!startPos || !currentPos) return;
        
        ctx.save();
        ctx.strokeStyle = style?.strokeColor || '#000';
        ctx.lineWidth = style?.strokeWidth || 2;
        ctx.setLineDash([5, 5]);
        
        const centerX = (startPos.x + currentPos.x) / 2;
        const centerY = (startPos.y + currentPos.y) / 2;
        
        ctx.beginPath();
        ctx.moveTo(centerX, startPos.y);
        ctx.lineTo(currentPos.x, centerY);
        ctx.lineTo(centerX, currentPos.y);
        ctx.lineTo(startPos.x, centerY);
        ctx.closePath();
        ctx.stroke();
        
        ctx.restore();
    }
};