/* eslint-disable no-undef */
// WebSocket client optimized

const myHost = window.location.hostname
const wsPort = 8018
const wsUrl = `wss://${myHost}/`

// const httpUrl = `http://${myHost}:8017/`

const ws = new WebSocket(wsUrl, "echo-protocol")
async function fetchStatistical(options) {
  try {
    const res = await fetch("/", options)
    if (!res) throw new Error("Network response was not ok")
    return await res.json()
  } catch (err) {
    console.error("Fetch error:", err)
    return null
  }
}

async function loadManualValue() {
  const url = `/statistical_manual`
  const soluong = parseInt($("#soluongchuky").val())
  let options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ soluongchuky: soluong, loai: 300 })
  }

  const content = await fetchStatistical(options)

  if (content) {
    updateDiv([content])
    $("#thongke_auto_5p_manual").removeClass("is-hidden")
  }
}

ws.addEventListener("open", () => {
  console.log("WebSocket connected")
  let url = httpUrl + "statistical"
  // fetchStatistical(url)
})

ws.addEventListener("message", (event) => {
  const data = JSON.parse(event.data)
  if (data.type === 300) showResult5p(data)
})

ws.addEventListener("close", () => {
  $("#title_5p").text("WebSocket disconnected").addClass("is-error")
  console.log("WebSocket disconnected")
})

ws.addEventListener("error", (error) => {
  console.error("WebSocket error:", error)
})

async function loadDefaultValue() {
  const url = `${httpUrl}statistical`
  const options = {
    method: "GET"
  }

  const data = await fetchStatistical(url, options)
  if (data) updateDiv(data.newStatistical)
}

function showResult5p(data) {
  if (data.msg === "timer") {
    const [, time] = data.times.split("-")
    $("#title_5p").text(`${time}  Next: ${data.timeleft}s`)
  }
  if (data.msg === "new_statistical") {
    updateDiv(data.newStatistical)
  }
}

$("#btn_search").click(loadManualValue)
window.addEventListener("DOMContentLoaded", loadDefaultValue)
