import { drawSelection } from './drawSelection';

export function renderSelections(ctx, shapes, selectedShapeIds) {
    // Draw selection indicators for selected shapes
    selectedShapeIds.forEach(id => {
        const shape = shapes.find(s => s.id === id);
        if (shape) {
            drawSelection(ctx, shape);
        }
    });
}
