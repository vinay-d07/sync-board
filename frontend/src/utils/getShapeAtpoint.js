export function getShapesInRectangle(selectionStart, selectionEnd, shapes) {
    if (!selectionStart || !selectionEnd) return [];

    const minX = Math.min(selectionStart.x, selectionEnd.x);
    const maxX = Math.max(selectionStart.x, selectionEnd.x);
    const minY = Math.min(selectionStart.y, selectionEnd.y);
    const maxY = Math.max(selectionStart.y, selectionEnd.y);

    const shapesInSelection = [];

    for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i];

        if (isShapeInRectangle(shape, minX, maxX, minY, maxY)) {
            shapesInSelection.push(shape.id);
        }
    }

    return shapesInSelection;
}

function isShapeInRectangle(shape, minX, maxX, minY, maxY) {
    switch (shape.type) {
        case "rectangle": {
            const shapeMinX = Math.min(shape.startPos.x, shape.endPos.x);
            const shapeMaxX = Math.max(shape.startPos.x, shape.endPos.x);
            const shapeMinY = Math.min(shape.startPos.y, shape.endPos.y);
            const shapeMaxY = Math.max(shape.startPos.y, shape.endPos.y);

            return !(shapeMaxX < minX || shapeMinX > maxX || shapeMaxY < minY || shapeMinY > maxY);
        }

        case "rect": {
            return !(shape.x + shape.width < minX || shape.x > maxX || shape.y + shape.height < minY || shape.y > maxY);
        }

        case "circle": {
            const centerX = (shape.startPos.x + shape.endPos.x) / 2;
            const centerY = (shape.startPos.y + shape.endPos.y) / 2;
            const radiusX = Math.abs(shape.endPos.x - shape.startPos.x) / 2;
            const radiusY = Math.abs(shape.endPos.y - shape.startPos.y) / 2;

            return !(centerX - radiusX > maxX || centerX + radiusX < minX ||
                centerY - radiusY > maxY || centerY + radiusY < minY);
        }

        case "line": {
            const lineStart = shape.startPos;
            const lineEnd = shape.endPos;

            return (isPointInRectangle(lineStart, minX, maxX, minY, maxY) ||
                isPointInRectangle(lineEnd, minX, maxX, minY, maxY) ||
                doesLineIntersectRectangle(lineStart, lineEnd, minX, maxX, minY, maxY));
        }

        case "rhombus": {
            const centerX = (shape.startPos.x + shape.endPos.x) / 2;
            const centerY = (shape.startPos.y + shape.endPos.y) / 2;
            const halfWidth = Math.abs(shape.endPos.x - shape.startPos.x) / 2;
            const halfHeight = Math.abs(shape.endPos.y - shape.startPos.y) / 2;

            const corners = [
                { x: centerX, y: centerY - halfHeight },
                { x: centerX + halfWidth, y: centerY },
                { x: centerX, y: centerY + halfHeight },
                { x: centerX - halfWidth, y: centerY }
            ];

            return corners.some(corner => isPointInRectangle(corner, minX, maxX, minY, maxY));
        }

        case "pencil": {
            if (!shape.path || shape.path.length === 0) return false;

            return shape.path.some(point => isPointInRectangle(point, minX, maxX, minY, maxY));
        }

        default:
            return false;
    }
}

function isPointInRectangle(point, minX, maxX, minY, maxY) {
    return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY;
}

function doesLineIntersectRectangle(lineStart, lineEnd, minX, maxX, minY, maxY) {
    return (isPointInRectangle(lineStart, minX, maxX, minY, maxY) ||
        isPointInRectangle(lineEnd, minX, maxX, minY, maxY));
}

export function getSelectionBounds(selectedShapeIds, shapes) {
    if (!selectedShapeIds || selectedShapeIds.length === 0) return null;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    for (const shapeId of selectedShapeIds) {
        const shape = shapes.find(s => s.id === shapeId);
        if (!shape) continue;

        const bounds = getShapeBounds(shape);
        if (bounds) {
            minX = Math.min(minX, bounds.minX);
            minY = Math.min(minY, bounds.minY);
            maxX = Math.max(maxX, bounds.maxX);
            maxY = Math.max(maxY, bounds.maxY);
        }
    }

    if (minX === Infinity) return null;

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
        minX, minY, maxX, maxY
    };
}

function getShapeBounds(shape) {
    switch (shape.type) {
        case "rectangle": {
            const minX = Math.min(shape.startPos.x, shape.endPos.x);
            const maxX = Math.max(shape.startPos.x, shape.endPos.x);
            const minY = Math.min(shape.startPos.y, shape.endPos.y);
            const maxY = Math.max(shape.startPos.y, shape.endPos.y);
            return { minX, maxX, minY, maxY };
        }

        case "rect": {
            return {
                minX: shape.x,
                maxX: shape.x + shape.width,
                minY: shape.y,
                maxY: shape.y + shape.height
            };
        }

        case "circle": {
            const centerX = (shape.startPos.x + shape.endPos.x) / 2;
            const centerY = (shape.startPos.y + shape.endPos.y) / 2;
            const radiusX = Math.abs(shape.endPos.x - shape.startPos.x) / 2;
            const radiusY = Math.abs(shape.endPos.y - shape.startPos.y) / 2;

            return {
                minX: centerX - radiusX,
                maxX: centerX + radiusX,
                minY: centerY - radiusY,
                maxY: centerY + radiusY
            };
        }

        case "line": {
            const minX = Math.min(shape.startPos.x, shape.endPos.x);
            const maxX = Math.max(shape.startPos.x, shape.endPos.x);
            const minY = Math.min(shape.startPos.y, shape.endPos.y);
            const maxY = Math.max(shape.startPos.y, shape.endPos.y);

            // Add some padding for line visibility
            const padding = 5;
            return {
                minX: minX - padding,
                maxX: maxX + padding,
                minY: minY - padding,
                maxY: maxY + padding
            };
        }

        case "rhombus": {
            const centerX = (shape.startPos.x + shape.endPos.x) / 2;
            const centerY = (shape.startPos.y + shape.endPos.y) / 2;
            const halfWidth = Math.abs(shape.endPos.x - shape.startPos.x) / 2;
            const halfHeight = Math.abs(shape.endPos.y - shape.startPos.y) / 2;

            return {
                minX: centerX - halfWidth,
                maxX: centerX + halfWidth,
                minY: centerY - halfHeight,
                maxY: centerY + halfHeight
            };
        }

        case "pencil": {
            if (!shape.path || shape.path.length === 0) return null;

            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

            for (const point of shape.path) {
                minX = Math.min(minX, point.x);
                maxX = Math.max(maxX, point.x);
                minY = Math.min(minY, point.y);
                maxY = Math.max(maxY, point.y);
            }

            // Add padding for pencil stroke visibility
            const padding = 3;
            return {
                minX: minX - padding,
                maxX: maxX + padding,
                minY: minY - padding,
                maxY: maxY + padding
            };
        }

        default:
            return null;
    }
}

export function getShapeAtPoint(pos, shapes) {
   
    for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i];


        if (isPointInsideShape(pos, shape)) {
            
            return shape;
        }
    }
    
    return null;
}

function distanceToSegment(pos, shape) {
    const x = pos.x;
    const y = pos.y;
    const x1 = shape.startPos.x;
    const y1 = shape.startPos.y;
    const x2 = shape.endPos.x;
    const y2 = shape.endPos.y;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;

    // If the segment has zero length, just return distance to the point
    if (lenSq === 0) {
        return Math.sqrt((x - x1) ** 2 + (y - y1) ** 2);
    }

    // Project pos onto the segment, clamped to [0, 1]
    const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lenSq));

    const nearestX = x1 + t * dx;
    const nearestY = y1 + t * dy;

    return Math.sqrt((x - nearestX) ** 2 + (y - nearestY) ** 2);
}


function isPointInsideShape(pos, shape) {


    switch (shape.type) {
        case "rectangle": {
            const minX = Math.min(shape.startPos.x, shape.endPos.x);
            const maxX = Math.max(shape.startPos.x, shape.endPos.x);
            const minY = Math.min(shape.startPos.y, shape.endPos.y);
            const maxY = Math.max(shape.startPos.y, shape.endPos.y);

            return (
                pos.x >= minX &&
                pos.x <= maxX &&
                pos.y >= minY &&
                pos.y <= maxY
            );
        }

        case "rect":
            return (
                pos.x >= shape.x &&
                pos.x <= shape.x + shape.width &&
                pos.y >= shape.y &&
                pos.y <= shape.y + shape.height
            );

        case "circle": {
            const centerX = (shape.startPos.x + shape.endPos.x) / 2;
            const centerY = (shape.startPos.y + shape.endPos.y) / 2;
            const radiusX = Math.abs(shape.endPos.x - shape.startPos.x) / 2;
            const radiusY = Math.abs(shape.endPos.y - shape.startPos.y) / 2;

            if (radiusX === 0 || radiusY === 0) return false;

            const dx = pos.x - centerX;
            const dy = pos.y - centerY;

            // Ellipse equation: (dx/rx)² + (dy/ry)² <= 1
            return (dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY) <= 1;
        }

        case "line":
            return distanceToSegment(pos, shape) < 5;

        case "rhombus": {
            const centerX = (shape.startPos.x + shape.endPos.x) / 2;
            const centerY = (shape.startPos.y + shape.endPos.y) / 2;
            const halfWidth = Math.abs(shape.endPos.x - shape.startPos.x) / 2;
            const halfHeight = Math.abs(shape.endPos.y - shape.startPos.y) / 2;

            const dx = Math.abs(pos.x - centerX);
            const dy = Math.abs(pos.y - centerY);

            return (dx / halfWidth) + (dy / halfHeight) <= 1;
        }

        case "pencil":
            if (!shape.path || shape.path.length === 0) {
                return false;
            }

            for (let i = 0; i < shape.path.length - 1; i++) {
                const segmentStart = shape.path[i];
                const segmentEnd = shape.path[i + 1];
                const segmentShape = {
                    startPos: segmentStart,
                    endPos: segmentEnd
                };
                const distance = distanceToSegment(pos, segmentShape);
                if (distance < 5) {
                    return true;
                }
            }
            return false;

        default:
            return false;
    }
}