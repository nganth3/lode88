import { GET_DB } from "~/config/mongodb"
import { BROADCAST_MESSEAGE } from "~/sockets/serverSocket"
import { makeDb, repair_db } from "../models/insertDb"
let allwayrun = true
const SERVICE_UPDATE_BROADCAST_DB = async () => {
  const db = GET_DB()

  while (allwayrun) {
    try {
      const msg = await makeDb(db).catch((err) => {
        console.error("Lỗi trong SERVICE_UPDATE_BROADCAST_DB: makeDb", err)
        return null
      })

      if (msg) BROADCAST_MESSEAGE(msg)
    } catch (e) {
      console.error("Có lỗi xảy ra:", e)
    }
    await awaitUntil()
  }
}

let SERVICE_CUOC_DB = async () => {
  console.log("test")
}
function awaitUntil() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("done")
    }, 1000)
  })
}
function repair() {
  repair_db()
}
function REPLY_STATISTICAL() {
  // return new Promise(async (resolve, reject) => {
  //     try {
  //         const coll_statistical = db.collection("statistical")
  //         const findResult = await coll_statistical.find({}).sort({ times: -1 }).toArray()
  //         if (!findResult.length) {
  //             return resolve({ msg: "new_statistical", type: 300, newStatistical:findResult })                }
  //     } catch (error) {
  //         console.error("Error in reply_statistical:", error)
  //         let msgError = {
  //             msg: "new_statistical",
  //             type: 300,
  //             newStatistical: [],
  //         }
  //         return reject(error)
  //     }
  // })
}

export const MY_SERVICES = {
  SERVICE_UPDATE_BROADCAST_DB: SERVICE_UPDATE_BROADCAST_DB,
  SERVICE_CUOC_DB: SERVICE_CUOC_DB,
  REPLY_STATISTICAL: REPLY_STATISTICAL,
  repair: repair
}
