import { CONNECT_DB, GET_DB } from '~/config/mongodb'
async function thongkeSolanXuathien() {
  await CONNECT_DB()
  let db =await GET_DB()
  let myColl = db.collection('lottery-results')
  let query = { date: '2025-05-13' }
  let findResult = await myColl.find(query).sort({ times: -1 }).limit(1).toArray()
  // Nối tất cả các phần tử dayso trong mảng findResult thành một mảng duy nhất
  const allDayso = findResult.flatMap(element => element.dayso)
  // Tạo một mảng mới chứa các số và số lần xuất hiện của chúng
  const allDayso_ThongKe = Array.from(
    allDayso.reduce((acc, num) => acc.set(num, (acc.get(num) || 0) + 1), new Map()),
    ([number, count]) => ({ number, count })
  )
  // Sắp xếp mảng theo số lần xuất hiện giảm dần
  allDayso_ThongKe.sort((a, b) => b.count - a.count)


}


thongkeSolanXuathien()