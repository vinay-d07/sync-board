import { getShapeAtPoint } from "../getShapeAtpoint";

export const SelectTool = {
    onMouseDown(ctx, pos, state) {
        const { shapes, selectedShapeIds, setSelectedShapes } = state;

        const shape = getShapeAtPoint(pos, shapes);

        if (shape) {
            if (selectedShapeIds.includes(shape.id)) {
                setSelectedShapes(
                    selectedShapeIds.filter(id => id !== shape.id)
                );
            } else {
                setSelectedShapes([shape.id]);
            }
        } else {
            setSelectedShapes([]);
        }
    },

    onMouseMove() { },

    onMouseUp() { },

    draw() { },
    drawPreview() { }
};