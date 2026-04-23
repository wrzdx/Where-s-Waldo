import express from "express"
import request from "supertest"
import { router } from "./route.js"
import { prisma } from "./prisma.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use("/", router)
afterEach(async () => {
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})
describe("POST /start", () => {
  test("should return a token", async () => {
    const res = await request(app).post("/start")

    expect(res.statusCode).toBe(200)
    expect(res.body.token).toBeDefined()
  })
})

describe("POST /scores", () => {
  test("should fail without token", async () => {
    const res = await request(app).post("/scores")

    expect(res.statusCode).toBe(401)
  })

  test("should save score", async () => {
    const start = await request(app).post("/start")
    const token = start.body.token
    const stop = await request(app)
      .post("/stop")
      .set("Authorization", `Bearer ${token}`)
    
    const stopToken = stop.body.token

    await request(app)
      .post("/scores")
      .set("Authorization", `Bearer ${stopToken}`)
      .send({ nickname: "test_user" })

    const users = await prisma.user.findMany({
      where: { nickname: "test_user" },
    })

    expect(users.length).toBe(1)
    expect(users[0].score).toBeGreaterThanOrEqual(0)
  })
})

describe("GET /scores", () => {
  test("should return users array", async () => {
    const res = await request(app).get("/scores")

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})
