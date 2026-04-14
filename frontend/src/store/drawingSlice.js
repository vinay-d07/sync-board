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

    }

})

export const { setIsDrawing, setCurrPos, setShapes, setLastPos } = drawingSlice.actions;
export default drawingSlice.reducer 