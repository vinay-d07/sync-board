export const circleTool = {
    onMouseDown(ctx, pos, state) {
        // Circle tool doesn't need to modify state on mouse down
        // The useCanvas hook handles setting startPos
    },

    onMouseMove(ctx, pos, state) {
        // Circle tool doesn't need to modify state on mouse move
        // The useCanvas hook handles real-time drawing
    },

    onMouseUp(ctx, pos, state) {
        // Circle tool doesn't need to modify state on mouse up
        // The useCanvas hook handles shape creation
    },

    createShape(state) {
        const start = state.startPos.current;
        const end = state.currentPos.current;

        if (!start || !end) return null;

        return {
            id: Date.now().toString(),
            type: 'circle',
            startPos: start,
            endPos: end,
            strokeStyle: state.strokeStyle,
            lineWidth: state.lineWidth,
        };
    },

    draw(ctx, shape) {
        const { startPos, endPos } = shape;
        if (!startPos || !endPos) return;

        const dx = endPos.x - startPos.x;
        const dy = endPos.y - startPos.y;
        const radius = Math.sqrt(dx * dx + dy * dy);

        ctx.strokeStyle = shape.strokeStyle || '#000';
        ctx.lineWidth = shape.lineWidth || 2;

        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
        ctx.stroke();
    },

    drawPreview(ctx, startPos, currentPos, style) {
        if (!startPos || !currentPos) return;

        const dx = currentPos.x - startPos.x;
        const dy = currentPos.y - startPos.y;
        const radius = Math.sqrt(dx * dx + dy * dy);

        ctx.save();
        ctx.strokeStyle = style?.strokeColor || '#000';
        ctx.lineWidth = style?.strokeWidth || 2;
        ctx.setLineDash([5, 5]);

        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }
};