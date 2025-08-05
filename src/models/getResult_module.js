let getSoHienTai = () => {
  return new Promise(async (resolve, reject) => {
    const loai = "300"
    const url = `https://api-rng.apixld.com/time-left/${loai}`
    await fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data == undefined) {
          console.log("Lỗi khi lấy dữ liệu từ API")
          return reject(null)
        }
        const { timeleft, current, result: resultArr } = data.rows

        resolve({
          timeleft,
          current,
          result: resultArr.map(xulydayso_2so)
        })
      })
      .catch((e) => {
        console.log(e)
        reject(null)
      })
  })
}

function xulydayso_2so(dayso) {
  const result = {}
  if (dayso.times) {
    result.times = dayso.times.toString().substr(8, 4)
    result.dateTimes = dayso.times.toString()
  }
  if (dayso.date) {
    result.time = dayso.date.toString().substr(11, 5)
    result.date = dayso.date.toString().substr(0, 10)
  }
  result.dayso = dayso.twooflast ? dayso.twooflast.split(" - ") : []
  return result
}

let getSoTheoChuky = async (soluongchuky) => {
  let dayso = []
  let result = {}
  let loai = 300
  let last_page
  let current_page = 0
  result.type = "chuky"
  do {
    let url = `https://api-rng.apixld.com/results/${loai}?page=${
      current_page + 1
    }&type=1`
    let onePage = await getPage(url)
    current_page = onePage.attrs.current_page
    last_page = onePage.attrs.last_page

    onePage.rows.forEach((element) => {
      if (dayso.length < soluongchuky) dayso.push(xulydayso_2so(element))
    })
    result.tongchuky = onePage.attrs.total
  } while (current_page < last_page && dayso.length < soluongchuky)

  result.result = dayso
  return result
}

function getPage(url) {
  return new Promise((r) => {
    fetch(url, {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        priority: "u=0, i",
        "sec-ch-ua": '"Brave";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "sec-gpc": "1",
        "upgrade-insecure-requests": "1"
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "omit"
    })
      .then((response) => response.json())
      .then((response) => r(response))
  })
}

export { getSoHienTai, getSoTheoChuky }
