$("#btn_find_mumber_5p").click(function () {
    let searchNumber = $("#input_mumber_5p").val();

    $(".cell").removeClass("highlighted"); // Xóa hết highlight trước

    $(".cell").each(function () {
        if ($(this).attr("number") && $(this).attr("number").includes(searchNumber)) {

            $(this).addClass("highlighted");
            this.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    });
});
