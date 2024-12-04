$(function() {
    $("body").fadeIn();

    $(".sidebar-toggler").off("click").on("click", function() {
        $("#page-content").toggleClass("full");
    })

    var user = {
        nome: localStorage.getItem("username")
    }

    $("#userMenu > span").html(user.nome);

    initNavbar();
});

checkLogin();

function checkLogin() {
    if ($("body#login").length != 1) {
        if (!localStorage.getItem('username') || !localStorage.getItem('role') || !localStorage.getItem('isMaster')) {
            window.location = "/index.html";
        }
    }
}

function initNavbar() {
    $("#btnDash").off("click").on("click", function () {
        if ($(this).hasClass("dash")) return;
        window.location = "/dashboard.html";
    })
}

$("#logout").off("click").on("click", function() {
    localStorage.clear();
    checkLogin();
})