import "./css/App.css"
import { Outlet } from "react-router"
import { Footer } from "./components/Footer/Footer"

export function App() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  )
}