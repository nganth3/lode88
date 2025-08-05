/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import {
  REPLY_STATISTICAL,
  REPLY_STATISTICAL_MANUAL
} from "../models/reply_statistical.js"
let index = (req, res) => {
  res.render("index", { title: "Expresxsx" })
}
let statistical_auto = async (req, res) => {
  let data = await REPLY_STATISTICAL()
  // console.log (data)
  res.status(200).json(data)
}
let statistical_manual = async (req, res) => {
  // console.log(req.body)
  let soluongchuky = kiemTraVaTraVeGiaTri(req.body.soluongchuky)

  let data = await REPLY_STATISTICAL_MANUAL(soluongchuky)
  res.status(200).json(data)
}
function kiemTraVaTraVeGiaTri(giaTri) {
  const value = Number(giaTri)
  return Number.isInteger(value) && value > 0 ? value : 1
}
let mt4_id = (req, res) => {
  console.log("mt4_id")
  res.send("69630625")
}
export const CONTROLER = {
  index,
  statistical_auto,
  statistical_manual,
  mt4_id
}
