/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import exitHook from "async-exit-hook"
import cors from "cors"
import express from "express"
import path from "path"
import { MY_SERVICES } from "~/services/my_services"
import { env } from "./config/environment"
import { CLOSE_DB, CONNECT_DB } from "./config/mongodb"
import { START_WEB_SOCKET } from "./sockets/serverSocket"

import { router } from "~/routes/index"

const START_SERVER = () => {
  const app = express()

  // Define CORS options before using them
  const corsOptions = {
    allowedHeaders: ["*"], // you can change the headers
    exposedHeaders: ["*"], // you can change the headers
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false
  }

  // view engine setup
  app.use(cors(corsOptions))

  app.set("views", path.join(__dirname, "views"))
  app.set("view engine", "ejs")

  app.use(express.static(path.join(__dirname, "public")))
  app.use("/js", express.static(path.join(__dirname, "public/js")))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // app.get("/", CONTROLER.index_controler)
  // app.get("/statistical", cors(), CONTROLER.statistical_controler)
  // app.post("/statistical_manual", CONTROLER.statistical_manual_controler)

  app.use("/", router)

  //app.use("/api/v1", indexRouter)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Server is running at ${env.APP_HOST} port ${env.APP_PORT}`)
  })

  exitHook(() => {
    console.log("Exiting ...")
    CLOSE_DB()
  })
}
const START_APP = async () => {
  try {
    await CONNECT_DB() // Connect to MongoDB

    START_SERVER()
    MY_SERVICES.SERVICE_UPDATE_BROADCAST_DB()
    MY_SERVICES.repair()
    START_WEB_SOCKET(env.SOCKET_PORT) // Start WebSocket server
    // START_WEB_SOCKET()
    // console.log(a
    // wait GET_DB().listCollections().toArray())
  } catch (error) {
    console.error("Error initializing MongoDB connection:", error)
    process.exit(0)
  }
}

export default START_APP
