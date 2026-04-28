import { createContext, useContext, useRef } from "react"
import { decrement, increment } from "../store/canvasSlice";
import { useSelector, useDispatch } from "react-redux";
import { setCurrPos, setIsDrawing, setLastPos, setSelectedShapes, setShapes, setTool, updateStyle, setSelectionStart, setSelectionEnd, clearSelection, startDrag, endDrag, updateShapes } from "../store/drawingSlice";
const CanvasContext = createContext()


const CanvasProvider = ({ children }) => {
    const canvasRef = useRef(null);


    const count = useSelector((state) => state.counter?.value);
    const canvasState = useSelector((state) => state.drawing)
    const dispatch = useDispatch();


    const actions = {
        inc: () => dispatch(increment()),
        dec: () => dispatch(decrement()),
        setCurrPos: (e) => dispatch(setCurrPos(e)),
        setIsDrawing: (val) => dispatch(setIsDrawing(val)),
        setShapes: (shape) => dispatch(setShapes(shape)),
        setLastPos: (e) => dispatch(setLastPos(e)),
        setTool: (t) => dispatch(setTool(t)),
        setSelectedShapes: (id) => dispatch(setSelectedShapes(id)),
        updateStyle: (data) => dispatch(updateStyle(data)),
        setSelectionStart: (pos) => dispatch(setSelectionStart(pos)),
        setSelectionEnd: (pos) => dispatch(setSelectionEnd(pos)),
        clearSelection: () => dispatch(clearSelection()),
        startDrag: (dragData) => dispatch(startDrag(dragData)),
        endDrag: () => dispatch(endDrag()),
        updateShapes: (shapes) => dispatch(updateShapes(shapes))
    }

    return (
        <CanvasContext.Provider value={{ count, ...actions, ...canvasState, canvasRef }}>
            {children}
        </CanvasContext.Provider >
    )
}

export const useCanvasContext = () => {
    const context = useContext(CanvasContext);

    if (!context) {
        throw new Error("useCanvasContext must be used within a CanvasProvider");
    }

    return context;
}

export { CanvasContext, CanvasProvider }