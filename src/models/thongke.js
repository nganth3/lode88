async function thongkeSolanXuathien(collection, query, limit, sort, iddiv) {
  const findResult = await collection
    .find(query)
    .sort({ times: -1 })
    .limit(limit)
    .toArray()
  if (!findResult.length) {
    return {
      chuky: null,
      sochuaxo: Array.from({ length: 100 }, (_, i) =>
        i.toString().padStart(2, "0")
      ),
      sodaxo: [],
      allPhien: []
    }
  }

  const chuky = {
    form: findResult[findResult.length - 1].times,
    to: findResult[0].times,
    times: findResult.length
  }

  const allDayso = findResult.flatMap((element) => element.dayso)
  const allPhien = findResult.map((element) => ({
    [element.times]: element.dayso
  }))

  const countMap = new Map()
  for (const num of allDayso) {
    countMap.set(num, (countMap.get(num) || 0) + 1)
  }
  let sodaxo = Array.from(countMap, ([number, count]) => ({ number, count }))
  if (sort) {
    sodaxo.sort((a, b) => b.count - a.count)
  }

  const sochuaxo = []
  for (let i = 0; i < 100; i++) {
    const so = i.toString().padStart(2, "0")
    if (!countMap.has(so)) {
      sochuaxo.push(so)
    }
  }

  return {
    iddiv: iddiv,
    chuky,
    sochuaxo,
    sodaxo,
    allPhien
  }
}
async function getNewStatistical(collection) {
  const findResult = await collection.find().sort({ times: -1 }).toArray()
  if (!findResult.length) {
    return {
      newStatistical: findResult
    }
  }
}
module.exports = { thongkeSolanXuathien, getNewStatistical }
