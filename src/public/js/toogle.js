$(".icon-toogle").click(function () {
  console.log(this)
  let e_id = $(this).attr("e-thongke-id")
  let type_click = $(this).attr("icon-toogle")

  if (type_click == "minimize") {
    $(`#${e_id}`).addClass("is-hidden")
    let next = $(this).next()
    next.removeClass("is-hidden")
    $(this).addClass("is-hidden")
  } else {
    $(`#${e_id}`).removeClass("is-hidden")
    let prev = $(this).prev()
    prev.removeClass("is-hidden")
    $(this).addClass("is-hidden")
  }
})
$(".thongke_title").click(function () {
  console.log("-----")
  const $tab = $(this).parent().parent().find(".table-infor")
  const vl = $tab.css("max-height")
  console.log(vl)
  if (vl == "150px") {
    $tab.css("max-height", "350px")
  } else {
    $tab.css("max-height", "150px")
  }
})
$(".tabs-tab").click((evt) => {
  $(".tabs-tab").removeClass("is-active")
  $(evt.target).parent().addClass("is-active")
  let tab = $(evt.target).parent().attr("tab-content")
  $(".tabs-tab-content").addClass("is-hidden")
  $(`.${tab}`).removeClass("is-hidden")
})
