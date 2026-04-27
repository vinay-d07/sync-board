export function getShapeAtPoint(pos, shapes) {
    for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i];

        if (isPointInsideShape(pos, shape)) {
            return shape;
        }
    }
    return null;
}

function isPointInsideShape(pos, shape) {
    switch (shape.type) {
        case "rect":
            return (
                pos.x >= shape.x &&
                pos.x <= shape.x + shape.width &&
                pos.y >= shape.y &&
                pos.y <= shape.y + shape.height
            );

        case "circle":
            const dx = pos.x - shape.cx;
            const dy = pos.y - shape.cy;
            return dx * dx + dy * dy <= shape.radius * shape.radius;

        case "line":
            return distanceToSegment(pos, shape) < 5;

        default:
            return false;
    }
}