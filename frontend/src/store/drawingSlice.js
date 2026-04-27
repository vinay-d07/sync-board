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
        }

    }

})

export const { setIsDrawing, setCurrPos, setShapes, setLastPos, setTool, setSelectedShapes ,updateStyle} = drawingSlice.actions;
export default drawingSlice.reducer 