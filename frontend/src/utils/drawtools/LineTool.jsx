export const lineTool = {
    onMouseDown(ctx, pos, state) {
        // Line tool doesn't need to modify state on mouse down
        // The useCanvas hook handles setting startPos
    },

    onMouseMove(ctx, pos, state) {
        // Line tool doesn't need to modify state on mouse move
        // The useCanvas hook handles real-time drawing
    },

    onMouseUp(ctx, pos, state) {
        // Line tool doesn't need to modify state on mouse up
        // The useCanvas hook handles shape creation
    },

    createShape(state) {
        const start = state.startPos.current;
        const end = state.currentPos.current;

        if (!start || !end) return null;

        return {
            id: Date.now().toString(),
            type: 'line',
            startPos: start,
            endPos: end,
            strokeStyle: state.strokeStyle,
            lineWidth: state.lineWidth,
        };
    },

    draw(ctx, shape) {
        const { startPos, endPos } = shape;
        if (!startPos || !endPos) return;

        ctx.strokeStyle = shape.strokeStyle || '#000';
        ctx.lineWidth = shape.lineWidth || 2;

        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(endPos.x, endPos.y);
        ctx.stroke();
    },

    drawPreview(ctx, startPos, currentPos, style) {
        if (!startPos || !currentPos) return;

        ctx.save();
        ctx.strokeStyle = style?.strokeColor || '#000';
        ctx.lineWidth = style?.strokeWidth || 2;
        ctx.setLineDash([5, 5]);

        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(currentPos.x, currentPos.y);
        ctx.stroke();

        ctx.restore();
    }
};