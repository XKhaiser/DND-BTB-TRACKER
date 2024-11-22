$(function() {
    $("body").fadeIn();
});

checkLogin();

function checkLogin() {
    if ($("body#login").length != 1) {
        if (!localStorage.getItem('username') || !localStorage.getItem('role') || !localStorage.getItem('isMaster')) {
            window.location = "/index.html";
        }
    }
}