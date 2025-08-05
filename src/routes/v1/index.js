/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import express from 'express'
import { StatusCodes } from 'http-status-codes'
let app = express()

const router = express.Router()

router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ status: 'OK!' })
})
router.get('/statistical', (req, res) => {
  // let db = GET_DB()
  // console.log('db', db)
  // let coll_statistical = db.collection('statistical')
  res.status(StatusCodes.OK).json({ status: 'OK!' })
})
// app.get('/', (req, res) => {
//   // Test Absolute import mapOrder
//   res.end('<h1>Hello World!</h1><hr>')
// })
// app.get('/', (req, res) => {
//   // Test Absolute import mapOrder
//   res.end('<h1>Hello World!</h1><hr>')
// })


/** Example APIs */
// router.use('/example', exampleRoute)

/** Check APIs v1/status */

export const APIs_V1 = router
