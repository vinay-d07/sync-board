export const pencilTool = {
    onMouseDown(ctx, pos, state) {
        state.currentPath.current.length = 0;
        state.currentPath.current.push(pos);
    },

    onMouseMove(ctx, pos, state) {
        state.currentPath.current.push(pos);
    },

    onMouseUp(ctx, pos, state) {},

    createShape(state) {
        const path = state.currentPath.current;
        if (!path.length) return null;

        return {
            id: Date.now().toString(),
            type: 'pencil',
            path: [...path],
            strokeStyle: state.strokeStyle || '#000',
            lineWidth: state.lineWidth || 2,
            timestamp: Date.now()
        };
    },

    draw(ctx, shape) {
        if (!shape.path || shape.path.length === 0) return;

        ctx.strokeStyle = shape.strokeStyle || '#000';
        ctx.lineWidth = shape.lineWidth || 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(shape.path[0].x, shape.path[0].y);

        for (let i = 1; i < shape.path.length; i++) {
            ctx.lineTo(shape.path[i].x, shape.path[i].y);
        }

        ctx.stroke();
    },

    drawPreview(ctx, state) {
        const path = state.currentPath.current;
        if (!path.length) return;

        ctx.strokeStyle = state.strokeStyle || '#000';
        ctx.lineWidth = state.lineWidth || 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);

        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }

        ctx.stroke();
    }
};