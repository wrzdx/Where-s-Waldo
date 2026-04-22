import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./css/reset.css"
import Router from "./router"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
