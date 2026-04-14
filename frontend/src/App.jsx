
import './App.css'
import { CanvasRender } from './canvasLayer/CanvasRender';
import { Button } from './components/ui/button';
import { useCanvasContext } from './context/CanvasContext'
import { useCanvas } from './hooks/useCanvas';

function App() {
  const { isDrawing, currPos, lastpos, canvasRef } = useCanvasContext();
  const { onMouseDown, onMouseUp, onMouseMove } = useCanvas(canvasRef)
  return (
    <>
      <div className=''>
        isDrawing : {isDrawing ? "yes" : "no"}, ||  currPos : {currPos.x},{currPos.y} ||, lastPos : {lastpos.x} , {lastpos.y}

        <CanvasRender onMouseUp={onMouseUp} onMouseDown={onMouseDown} onMouseMove={onMouseMove} canvasRef={canvasRef} className="border-2 border-black" />

      </div>
    </>
  )
}

export default App
