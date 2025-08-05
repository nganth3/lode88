import moment from "moment/moment.js"
import { GET_DB } from "../config/mongodb.js"
import { thongkeSolanXuathien } from "./thongke.js"

async function REPLY_STATISTICAL() {
  let db = GET_DB()
  const coll_statistical = db.collection("statistical")
  const findResult = await coll_statistical.find().sort({ times: -1 }).toArray()

  if (findResult.length > 0) {
    return { msg: "new_statistical", type: 300, newStatistical: findResult }
  }
}
async function REPLY_STATISTICAL_MANUAL(soluong) {
  let db = GET_DB()
  const coll_lottery_results = db.collection("lottery-results")
  let query = { date: moment(Date.now()).format("YYYY-MM-DD") }
  let findResult = await thongkeSolanXuathien(
    coll_lottery_results,
    query,
    soluong,
    true,
    "thongke_auto_5p_manual"
  )
  return findResult
}
export { REPLY_STATISTICAL, REPLY_STATISTICAL_MANUAL }
