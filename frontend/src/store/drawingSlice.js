import { createSlice } from "@reduxjs/toolkit"

const drawingSlice = createSlice({
    name: "drawing",
    initialState: {
        isDrawing: false,
        currPos: {
            x: 0,
            y: 0
        },
        shapes: [],
        lastpos: {
            x: 0,
            y: 0
        },
        tool: "cursor",
        selectedShapeIds: [],
        selection: {
            start: null,
            end: null
        },
        drag: {
            isDragging: false,
            dragType: null, // 'move' or 'resize'
            handleType: null, // 'nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e'
            startPos: null,
            originalBounds: null,
            originalShapes: null
        },
        style: {
            strokeColor: "#000000",
            fillColor: "transparent",
            strokeWidth: 2,
            opacity: 1,
        }
    },
    reducers: {
        setIsDrawing: (state, action) => {
            state.isDrawing = action.payload;
        },
        setCurrPos: (state, action) => {
            state.currPos.x = action.payload.x;
            state.currPos.y = action.payload.y
        },
        setShapes: (state, action) => {
            state.shapes.push(action.payload)
        },
        setLastPos: (state, action) => {
            state.lastpos.x = action.payload.x;
            state.lastpos.y = action.payload.y
        },
        setTool: (state, action) => {
            state.tool = action.payload
        },
        setSelectedShapes: (state, action) => {
            state.selectedShapeIds = Array.isArray(action.payload) ? action.payload : [action.payload].filter(Boolean);
        },
        updateStyle: (state, action) => {
            Object.assign(state.style, action.payload);
        },
        setSelectionStart: (state, action) => {
            state.selection.start = action.payload;
        },
        setSelectionEnd: (state, action) => {
            state.selection.end = action.payload;
        },
        clearSelection: (state) => {
            state.selection.start = null;
            state.selection.end = null;
        },
        startDrag: (state, action) => {
            const { dragType, handleType, startPos, originalBounds, originalShapes } = action.payload;
            state.drag.isDragging = true;
            state.drag.dragType = dragType;
            state.drag.handleType = handleType;
            state.drag.startPos = startPos;
            state.drag.originalBounds = originalBounds;
            state.drag.originalShapes = originalShapes;
        },
        updateDrag: (state, action) => {
            // This will be handled by the tool during drag operations
        },
        endDrag: (state) => {
            state.drag.isDragging = false;
            state.drag.dragType = null;
            state.drag.handleType = null;
            state.drag.startPos = null;
            state.drag.originalBounds = null;
            state.drag.originalShapes = null;
        },
        updateShapes: (state, action) => {
            // Replace shapes array entirely for bulk updates
            state.shapes = action.payload;
        }

    }

})

export const { setIsDrawing, setCurrPos, setShapes, setLastPos, setTool, setSelectedShapes, updateStyle, setSelectionStart, setSelectionEnd, clearSelection, startDrag, updateDrag, endDrag, updateShapes } = drawingSlice.actions;
export default drawingSlice.reducer