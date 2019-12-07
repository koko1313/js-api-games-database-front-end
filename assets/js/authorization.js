function login() {
    var username = $("#username").val();
    var password = $("#password").val();

    $.ajax({
        method: "POST",
        url: SERVER_URL + "/login",
        data: {
            username: username,
            password: password
        },
        xhrFields: {withCredentials: true},
        complete: function(data) {
            switch(data.status) {
                case 200 :
                    getWhoAmI();
                    break;
                case 404 : 
                    alert("Грешно име или парола!");
                    break;
                
            }
        }
    });
}

function logout() {
    $.ajax({
        method: "POST",
        url: SERVER_URL + "/logout-user",
        xhrFields: {withCredentials: true},
        complete: function(data) {
            location.href = "index.html";
        }
    });
}

function getWhoAmI(callback) {
    $.ajax({
        method: "GET",
        url: SERVER_URL + "/getWhoAmI",
        xhrFields: {withCredentials: true},
        complete: function(data) {
            callback(data);
        }
    });
}

// показва/скрива бутоните за вход/регистрация, зависи дали е логнат потребител
function showLoginOrLogoutMenuButton() {
    getWhoAmI(function(data) {
        var loggedUser = data.responseJSON;
        // if there is logged user
        if(loggedUser != undefined) {
            $("#loggedUserLabel").text(loggedUser.username); // сетва името на логнатия потребител
            $("#logoutMenuButton").show();
        } else {
            $("#loginMenuButton").show();
        }
    });
}

$(document).ready(function() {
    showLoginOrLogoutMenuButton();
});