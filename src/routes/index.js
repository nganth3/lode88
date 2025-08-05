import express from "express"

import { CONTROLER } from "~/controllers/controller"
export const router = express.Router()
const corsOptions = {
  origin: ["http://localhost:8017", "http://nganth3.ddnsfree.com:8017"], // Allow all origins (for development). Change to specific domains in production.
  methods: ["GET", "POST", "PUT", "DELETE"]
}

router.get("/", CONTROLER.index)
router.get("/statistical", CONTROLER.statistical_auto)
router.post("/statistical_manual", CONTROLER.statistical_manual)
router.get("/mt4_getid", CONTROLER.mt4_id)
router.post("/mt4_getid", CONTROLER.mt4_id)

// view engine setup
