const { env } = require("~/config/environment")

let send_mesage_to_group_0 = async (ms) => {
  console.log("BOT TELE SEND MS")
  let token = env.TELE_BOT_HTTP_API_TOKEN
  let id_group = "-4973233085"
  let url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${id_group}&text=${ms}&parse_mode=HTML`

  console.log(url)
  const https = require("https")

  // custom agent as global variable
  const agent = new https.Agent({
    rejectUnauthorized: false
  })
  // node-fetch request with custom agent
  // try {
  //   await fetch(url)
  //     .then((r) => r.json())
  //     .then((r) => console.log(r.ok))
  //     .catch((e) => {
  //       console.log("BOT TELE ERROR" + e)
  //       return e
  //     })
  // } catch (error) {
  //   console.log("BOT TELE ERROR" + error)
  // }
}

let send_mesage_to_group = (message) => {
  const botToken = env.TELE_BOT_HTTP_API_TOKEN
  const chatId = "-4973233085"
  const url = `httpS://api.telegram.org/bot${botToken}/sendMessage`

  const data = {
    chat_id: chatId,
    text: message,
    parse_mode: "HTML"
  }
  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: botToken
    },
    body: JSON.stringify(data),
    agent
  }
  const https = require("https")

  // custom agent as global variable
  const agent = new https.Agent({
    rejectUnauthorized: false
  })
  // fetch(url, options)
  //   .then((response) => response.json())
  //   .then((responseData) => {
  //     console.log("Message sent:", responseData)
  //   })
  //   .catch((error) => {
  //     console.error("Error sending message:", error)
  //   })
}

export const BOT_TELE = { send_mesage_to_group }
