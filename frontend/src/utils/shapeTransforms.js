

export function moveShapes(selectedShapeIds, shapes, deltaX, deltaY) {

    return shapes.map(shape => {
        if (!selectedShapeIds.includes(shape.id)) return shape;

        const newShape = { ...shape };

        switch (shape.type) {
            case "rectangle":
            case "circle":
            case "line":
            case "rhombus":
                newShape.startPos = {
                    x: shape.startPos.x + deltaX,
                    y: shape.startPos.y + deltaY
                };
                newShape.endPos = {
                    x: shape.endPos.x + deltaX,
                    y: shape.endPos.y + deltaY
                };
                break;

            case "rect":
                newShape.x = shape.x + deltaX;
                newShape.y = shape.y + deltaY;
                break;

            case "pencil":
                if (shape.path && Array.isArray(shape.path)) {
                    newShape.path = shape.path.map(point => ({
                        x: point.x + deltaX,
                        y: point.y + deltaY
                    }));
                } else {
                    console.log('Pencil shape has no path or invalid path:', shape);
                }
                break;
        }

        return newShape;
    });
}

export function resizeShapes(selectedShapeIds, shapes, handleType, originalBounds, newBounds) {
    if (!originalBounds || !newBounds) return shapes;

    const scaleX = newBounds.width / originalBounds.width;
    const scaleY = newBounds.height / originalBounds.height;
    const deltaX = newBounds.x - originalBounds.x;
    const deltaY = newBounds.y - originalBounds.y;

    return shapes.map(shape => {
        if (!selectedShapeIds.includes(shape.id)) return shape;

        const newShape = { ...shape };

        switch (shape.type) {
            case "rectangle":
            case "rhombus":
                newShape.startPos = resizePoint(shape.startPos, originalBounds, handleType, scaleX, scaleY, deltaX, deltaY);
                newShape.endPos = resizePoint(shape.endPos, originalBounds, handleType, scaleX, scaleY, deltaX, deltaY);
                break;

            case "circle":
                // For circles, we need to maintain the center and scale radius
                const centerX = (shape.startPos.x + shape.endPos.x) / 2;
                const centerY = (shape.startPos.y + shape.endPos.y) / 2;
                const radiusX = Math.abs(shape.endPos.x - shape.startPos.x) / 2;
                const radiusY = Math.abs(shape.endPos.y - shape.startPos.y) / 2;

                const newCenterX = resizePoint({ x: centerX, y: centerY }, originalBounds, handleType, scaleX, scaleY, deltaX, deltaY);
                const newRadiusX = radiusX * scaleX;
                const newRadiusY = radiusY * scaleY;

                newShape.startPos = {
                    x: newCenterX.x - newRadiusX,
                    y: newCenterX.y - newRadiusY
                };
                newShape.endPos = {
                    x: newCenterX.x + newRadiusX,
                    y: newCenterX.y + newRadiusY
                };
                break;

            case "line":
                newShape.startPos = resizePoint(shape.startPos, originalBounds, handleType, scaleX, scaleY, deltaX, deltaY);
                newShape.endPos = resizePoint(shape.endPos, originalBounds, handleType, scaleX, scaleY, deltaX, deltaY);
                break;

            case "rect":
                const newRectPos = resizePoint({ x: shape.x, y: shape.y }, originalBounds, handleType, scaleX, scaleY, deltaX, deltaY);
                newShape.x = newRectPos.x;
                newShape.y = newRectPos.y;
                newShape.width = shape.width * scaleX;
                newShape.height = shape.height * scaleY;
                break;

            case "pencil":
                if (shape.path) {
                    newShape.path = shape.path.map(point =>
                        resizePoint(point, originalBounds, handleType, scaleX, scaleY, deltaX, deltaY)
                    );
                }
                break;
        }

        return newShape;
    });
}

function resizePoint(point, bounds, handleType, scaleX, scaleY, deltaX, deltaY) {
    const relativeX = point.x - bounds.x;
    const relativeY = point.y - bounds.y;

    let newX = point.x;
    let newY = point.y;

    switch (handleType) {
        case 'nw': // top-left
            newX = bounds.x + relativeX * scaleX;
            newY = bounds.y + relativeY * scaleY;
            break;
        case 'ne': // top-right
            newX = bounds.x + deltaX + relativeX * scaleX;
            newY = bounds.y + relativeY * scaleY;
            break;
        case 'sw': // bottom-left
            newX = bounds.x + relativeX * scaleX;
            newY = bounds.y + deltaY + relativeY * scaleY;
            break;
        case 'se': // bottom-right
            newX = bounds.x + deltaX + relativeX * scaleX;
            newY = bounds.y + deltaY + relativeY * scaleY;
            break;
        case 'n': // top
            newX = bounds.x + deltaX / 2 + relativeX * scaleX;
            newY = bounds.y + relativeY * scaleY;
            break;
        case 's': // bottom
            newX = bounds.x + deltaX / 2 + relativeX * scaleX;
            newY = bounds.y + deltaY + relativeY * scaleY;
            break;
        case 'w': // left
            newX = bounds.x + relativeX * scaleX;
            newY = bounds.y + deltaY / 2 + relativeY * scaleY;
            break;
        case 'e': // right
            newX = bounds.x + deltaX + relativeX * scaleX;
            newY = bounds.y + deltaY / 2 + relativeY * scaleY;
            break;
    }

    return { x: newX, y: newY };
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
