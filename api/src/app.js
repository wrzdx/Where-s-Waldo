import "dotenv/config"
import express from "express"
import cors from "cors"
import { router } from "./route.js"

const PORT = process.env.PORT || 8000
const app = express()
app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)
app.options("*", cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)
app.listen(PORT, (error) => {
  if (error) {
    throw error
  }
  console.log(`You can access site on http://localhost:${PORT}`)
})
