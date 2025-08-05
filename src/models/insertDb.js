import moment from "moment"
import { GET_DB } from "../config/mongodb.js"
import {} from "../sockets/serverSocket.js"
import { getSoHienTai, getSoTheoChuky } from "./getResult_module"
import { thongkeSolanXuathien } from "./thongke"
// import {get} // Removed invalid import statement
let phienHientai = null

let sohientai = null

const makeDb = async () => {
  let db = GET_DB()
  return new Promise(async (resolve, reject) => {
    sohientai = await getSoHienTai().catch((err) => {
      console.log("getsohientai err" + err)
      reject("getsohientai err")
    })
    // console.log(sohientai)
    if (sohientai === null || sohientai === undefined) {
      console.log("sohientai null")
      reject("sohientai null")
    }

    if (sohientai != undefined && sohientai.current == phienHientai) {
      const msg_timeleft = {
        msg: "timer",
        type: 300,
        times: sohientai.current,
        timeleft: sohientai.timeleft
      }
      resolve(msg_timeleft)
    }

    if (sohientai != undefined && sohientai.current != phienHientai) {
      const resultCurrent = await db
        .collection("lottery-lottery_result_current")
        .find()

      if (!resultCurrent) {
        console.log("resultCurrent null" + resultCurrent)
        reject("lỗi tại resultCurrent")
      }

      phienHientai = resultCurrent.dateTimes
      phienHientai = sohientai.current
      await insertDB(db, sohientai)
      const coll_statistical = db.collection("statistical")

      await coll_statistical
        .find()
        .toArray()
        .then((newStatistical) =>
          resolve({ msg: "new_statistical", type: 300, newStatistical })
        )
        .catch((e) => {
          console.log(e)
          reject("lỗi tại coll_statistical")
        })
    }
  })
}
const repair_db = async () => {
  return new Promise(async (r) => {
    let db = GET_DB()
    let query = { date: moment().format("YYYY-MM-DD") }

    let check_chuky_hientai = await db
      .collection("lottery_result_current")
      .find()
      .toArray()

    let check_resuls_data = await db
      .collection("lottery-results")
      .find(query)
      .toArray()

    if (
      check_chuky_hientai[0] === undefined ||
      check_resuls_data === undefined
    ) {
      r("can not check dt")
    } else {
      if (parseInt(check_chuky_hientai[0].times) != check_resuls_data.length) {
        console.log(check_chuky_hientai[0].times, check_resuls_data.length)
        console.log("database wrong")
        db.collection("lottery").deleteMany(query)
        let lottery_results_allday = await getSoTheoChuky(1000)
        await insertDB(db, lottery_results_allday, true)
        r("repair database")
      }
      r("check db OK")
    }
  })

  // console.log("lottery_results_allday", lottery_results_allday.result.length)
}
async function insertDB(db, data, repair) {
  // console.log("insertDB: " + data.result[0].dateTimes)
  let coll_current = db.collection("lottery_result_current")
  let coll_results = db.collection("lottery-results")
  let coll_statistical = db.collection("statistical")

  if (!data?.result?.[0]) return
  let query = { date: data.result[0].date }
  const currentResult = { type: "current", ...data.result[0] }
  //update database==========================================
  await coll_current.updateOne(
    { type: "current" },
    { $set: currentResult },
    { upsert: true }
  )

  if (Array.isArray(data.result)) {
    await Promise.all(
      data.result.map((element) =>
        coll_results.updateOne(
          { dateTimes: element.dateTimes },
          { $set: element },
          { upsert: true }
        )
      )
    )
  }
  //===============================================
  // Updaete statistical===========================
  // Calculate statistics in parallel for better performance
  const [thongkeAllDay, thongkeCurrent, thongke10Times, thongke19Times] =
    await Promise.all([
      thongkeSolanXuathien(coll_results, query, 1000, true, "thongke_all"),
      thongkeSolanXuathien(coll_results, query, 1, null, "thongke_hientai"),
      thongkeSolanXuathien(coll_results, query, 10, true, "thongke_10t"),
      thongkeSolanXuathien(coll_results, query, 19, true, "thongke_19t")
    ])

  // Prepare update operations
  const updates = [
    { type: "all", data: thongkeAllDay },
    { type: "current", iddiv: "thongke_hientai", data: thongkeCurrent },
    { type: "thongke10Times", iddiv: "thongke_10t", data: thongke10Times },
    { type: "thongke19imes", iddiv: "thongke_19t", data: thongke10Times }
  ]

  // Perform updates in parallel
  await Promise.all(
    updates.map(({ type, data }) =>
      coll_statistical.updateOne(
        { type },
        { $set: { ...data, type } },
        { upsert: true }
      )
    )
  )
  let checkdb = await repair_db()
  console.log(checkdb)
  if (!repair) find_good_number(db, 18)
  //===============================================
}

// async function find_good_number_all(db) {
//   let sophien_tracking = 15
//   let date = moment().format("YYYY-MM-DD")

//   let query = { date }
//   let coll_results = db.collection("lottery-results")
//   let result = await thongkeSolanXuathien(
//     coll_results,
//     query,
//     sophien_tracking,
//     true,
//     "find_good_number"
//   )
//   let chuky = result.chuky
//   // console.log(result.chuky)
//   const { sochuaxo = [] } = result
//   if (sochuaxo.length > 0) {
//     const dayso = sochuaxo.join(" - ")
//     // dayso is ready for use
//     BOT_TELE.send_mesage_to_group(
//       `Chu kỳ ${chuky.form} - ${chuky.to}:\n Các số trong ${sophien_tracking} phiên chưa sổ: ${dayso}`
//     )
//   }
// }
const find_good_number = async (db, sophien) => {
  try {
    const coll_statistical = db.collection("statistical")
    const stat = await coll_statistical.findOne({ type: "all" })
    if (!stat?.allPhien) return []

    const { allPhien, chuky } = stat
    const find_result = Array.from({ length: 100 }, (_, i) => {
      const number = i.toString().padStart(2, "0")
      let count = 0
      for (const phien of allPhien) {
        const key = Object.keys(phien)[0]
        if (phien[key].includes(number)) break
        count++
      }
      return { number, count }
    })

    const dayso = find_result
      .filter((item) => item.count > sophien)
      .sort((a, b) => b.count - a.count)
    if (dayso.length) {
      const times = moment().format("DD/MM/YYYY HH:mm")
      let date = moment().format("YYYY-MM-DD")
      let good_numbers = dayso.map((item) => ({
        number: item.number,
        count: item.count,
        date,
        times
      }))
      // console.log("good_numbers", good_numbers)
      await db.collection("good_numbers").insertMany(good_numbers)
    }
  } catch (err) {
    console.error(err)
  }
}
module.exports = { makeDb, repair_db }
