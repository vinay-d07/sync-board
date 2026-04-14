import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from "react-redux";
import { BrowserRouter } from 'react-router-dom'
import { CanvasProvider } from './context/CanvasContext'
import { canvasStore } from './store/canvasStore';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={canvasStore}>

        <CanvasProvider>
          <App />
        </CanvasProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
