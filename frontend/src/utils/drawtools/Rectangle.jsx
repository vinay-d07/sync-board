export const rectTool = {
    onMouseDown(ctx, pos, state) {
        // Rectangle tool doesn't need to modify state on mouse down
        // The useCanvas hook handles setting startPos
    },

    onMouseMove(ctx, pos, state) {
        // Rectangle tool doesn't need to modify state on mouse move
        // The useCanvas hook handles real-time drawing
    },

    onMouseUp(ctx, pos, state) {
        // Rectangle tool doesn't need to modify state on mouse up
        // The useCanvas hook handles shape creation
    },

    createShape(state) {
        const start = state.startPos.current;
        const end = state.currentPos.current;

        if (!start || !end) return null;

        return {
            id: Date.now().toString(),
            type: 'rectangle',
            startPos: start,
            endPos: end,
            strokeStyle: state.strokeStyle,
            lineWidth: state.lineWidth,
        };
    },

    draw(ctx, shape) {
        // console.log("drawing rectangle")
        const { startPos, endPos } = shape;
        if (!startPos || !endPos) return;

        const width = endPos.x - startPos.x;
        const height = endPos.y - startPos.y;

        ctx.strokeStyle = shape.strokeStyle || '#000';
        ctx.lineWidth = shape.lineWidth || 2;

        ctx.strokeRect(startPos.x, startPos.y, width, height);
    },

    drawPreview(ctx, startPos, currentPos, style) {
        if (!startPos || !currentPos) return;

        const width = currentPos.x - startPos.x;
        const height = currentPos.y - startPos.y;

        ctx.save();
        ctx.strokeStyle = style?.strokeColor || '#000';
        ctx.lineWidth = style?.strokeWidth || 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(startPos.x, startPos.y, width, height);
        ctx.restore();
    }
};