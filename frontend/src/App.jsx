
import { useEffect } from 'react';
import './App.css'
import { ToolBar } from './canvasLayer/canvasComponents/ToolBar';
import { CanvasRender } from './canvasLayer/CanvasRender';

import { useCanvasContext } from './context/CanvasContext'
import { useCanvas } from './hooks/useCanvas';
import { ContextMenu } from './canvasLayer/canvasComponents/ContextMenu';

function App() {
  const { canvasRef, tool, setTool } = useCanvasContext();
  const { onMouseDown, onMouseUp, onMouseMove } = useCanvas(canvasRef)

  useEffect(() => { console.log(tool) }, [tool])
  return (
    <>

      <div className='flex items-center justify-center'>


        <ToolBar activeTool={tool} setTool={setTool} />
        <CanvasRender onMouseUp={onMouseUp} onMouseDown={onMouseDown} onMouseMove={onMouseMove} canvasRef={canvasRef} className="border-2 border-black" />
      </div>
      {(tool !== "cursor" && tool !== "hand") && <ContextMenu />}
    </>
  )
}

export default App
