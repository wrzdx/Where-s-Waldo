import "dotenv/config"
import express from "express"
import { router } from "./route.js"

const PORT = process.env.PORT || 8000
const app = express()
app.use(express.json())
app.use(express.urlencoded({ limit: "10mb", extended: true }))
app.use(router)
app.listen(PORT, (error) => {
  if (error) {
    throw error
  }
  console.log(`You can access site on http://localhost:${PORT}`)
})
