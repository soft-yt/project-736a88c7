import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App"
import { initBridge } from './lib/bridge-sdk'


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)


// Initialize bridge-sdk for Visual Editor
initBridge()