import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./canvasSlice"
import drawingReducer from "./drawingSlice"
export const canvasStore = configureStore({
    reducer: {
        counter: counterReducer,
        drawing: drawingReducer
    },
});