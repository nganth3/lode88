function updateDiv(dataArr) {
  const showChuaso = [
    "thongke_10t",
    "thongke_hientai",
    "thongke_auto_5p_manual"
  ]
  dataArr.forEach((element) => {
    makeDivDaxo(element)
    if (showChuaso.includes(element.iddiv)) makeDivChuaso(element)
  })
}

function makeDivDaxo(data) {
  const $container = $(`#${data.iddiv}`)
  $container
    .find(".thongke_title")
    .text(`${data.chuky.times}_${data.chuky.form}-${data.chuky.to}`)
  const sodaxo = data.sodaxo
  const strDiv = sodaxo
    .map(
      (e) =>
        `<div onclick="showChitietSo('${e.number}','${data.iddiv}','${e.count}')" number=${e.number} class="cell button">${e.number} - ${e.count}</div>`
    )
    .join("")
  $container
    .find(".daxo")
    .attr("data", JSON.stringify(data.allPhien))
    .html(strDiv)
}

function makeDivChuaso(data) {
  const $container = $(`#${data.iddiv}`)
  $container
    .find(".thongke_title")
    .text(`${data.chuky.times}_${data.chuky.form}-${data.chuky.to}`)
  const sochuaxo = data.sochuaxo
  const $chuaxo = $container.find(".chuaxo")
  if (!sochuaxo.length) {
    $chuaxo.addClass("is-hidden")
    return
  }
  const strDiv = sochuaxo
    .map(
      (e) =>
        `<div onclick="showChitietSo('${e}')" number=${e} class="cell button chuaxo">${e}</div>`
    )
    .join("")
  $chuaxo.html(strDiv).removeClass("is-hidden")
}

function showChitietSo(so, b) {
  const dayso = b
    ? JSON.parse($(`#${b} .daxo`).attr("data"))
    : JSON.parse($("#thongke_all_grid .daxo").attr("data"))
  let arrSolanKhongXuathien = []
  let thongbao = ""
  let solankhongxh = 1
  let count = 0

  dayso.forEach((item, index) => {
    const stt = (dayso.length - index).toString().padStart(2, "0")
    const values = Object.values(item)
    const key = Object.keys(item)
    const solan = values[0].filter((x) => x.toString() === so.toString()).length
    count += solan
    let nhanxet
    if (solan > 0) {
      arrSolanKhongXuathien.push(solankhongxh)
      nhanxet = `<div class="chitietso"> ${stt} - Phiên ${key} xuất hiện ${solan} lần </div>`
      solankhongxh = 1
    } else {
      nhanxet = `<div class="chitietso has-text-grey"> ${stt} - Phiên ${key} không có </div>`
      solankhongxh += 1
      if (stt == 1 && solankhongxh > 1) arrSolanKhongXuathien.push(solankhongxh)
    }
    thongbao += nhanxet
  })

  const solan_max = Math.max(...arrSolanKhongXuathien)
  const sum = arrSolanKhongXuathien.reduce((a, b) => a + b, 0)
  const solan_avg = Math.round(sum / arrSolanKhongXuathien.length)
  let sl_chuaxogannhat = arrSolanKhongXuathien[0]
  $(".modal").addClass("is-active")
  $(".modal-card-title").text(
    `${so} - S:${count} M:${solan_max} A:${solan_avg} N:${sl_chuaxogannhat - 1}`
  )
  $("#modal_chitiet").html(thongbao)
  $("#modal_infor").addClass("is-active")
}
