import { Link } from "react-router"
import { error } from "./Error.module.css"
import { Footer } from "../Footer/Footer"

const ErrorPage = () => {
  return (
    <>
      <main className={error + " container"}>
        <h1>Oh no, this route doesn't exist!</h1>
        <Link to="/">Go back to Home</Link>
      </main>
      <Footer />
    </>
  )
}

export default ErrorPage