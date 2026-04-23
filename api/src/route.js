import { Router } from "express"
import { prisma } from "./prisma.js"
import jwt from "jsonwebtoken"

export const router = Router()
router.get("/scores", async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: {
      score: "asc",
    },
  })
  res.json(users)
})

router.get("/users/:nickname", async (req, res) => {
  const { nickname } = req.params
  const user = await prisma.user.findUnique({
    where: { nickname },
  })

  return res.json(user)
})

router.post("/start", (req, res) => {
  const token = jwt.sign({ start_time: Date.now() }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  })

  return res.json({ token })
})

router.post("/stop", async (req, res) => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Invalid token format" })
  }

  const token = authHeader.split(" ")[1]
  let decoded = null
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    return res.status(401).json({ error: "token malformed" })
  }

  if (!decoded.start_time) {
    return res.status(401).json({ error: "token invalid" })
  }
  const score = Date.now() - decoded.start_time
  const newToken = jwt.sign({ score }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  })

  return res.json({ token: newToken })
})

router.post("/scores", async (req, res) => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Invalid token format" })
  }

  const token = authHeader.split(" ")[1]
  let decoded = null
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    return res.status(401).json({ error: "token malformed" })
  }

  const { nickname } = req.body

  if (!nickname) {
    return res.status(400).json({ error: "no nickname" })
  }

  const score = decoded.score

  const user = await prisma.user.findUnique({ where: { nickname } })
  if (!user) {
    await prisma.user.create({
      data: { nickname, score },
    })
  } else if (user.score > score) {
    await prisma.user.update({
      where: { nickname },
      data: { score },
    })
  }

  return res.json({ success: true })
})
