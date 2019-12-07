function login() {
    var username = $("#username").val();
    var password = $("#password").val();

    $.ajax({
        method: "POST",
        url: Server.SERVER_URL + "/login",
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
        url: Server.SERVER_URL + "/logout-user",
        xhrFields: {withCredentials: true},
        complete: function(data) {
            location.href = "index.html";
        }
    });
}

function getWhoAmI(callback) {
    $.ajax({
        method: "GET",
        url: Server.SERVER_URL + "/getWhoAmI",
        xhrFields: {withCredentials: true},
        complete: function(data) {
            callback(data);
        }
    });
}

// Проверява дали подадения потребител е админ
function isAdmin(loggedUser) {
    var userRoles = loggedUser.roles;

    for(var i=0; i<userRoles.length; i++) {
        if(userRoles[i].name == "ROLE_ADMIN") {
            return true
        }
    }

    return false;
}

function showElementsIfNotLogged() {
    getWhoAmI(function(data) {
        var loggedUser = data.responseJSON;
        // if there is not logged user
        if(loggedUser == undefined) {
            var elements = $(".show-if-not-logged");
            for(var i = 0; i < elements.length; i++) {
                $(elements[i]).show();
            }
        }
    });
}

function showElementsIfLogged() {
    getWhoAmI(function(data) {
        var loggedUser = data.responseJSON;
        // if there is logged user
        if(loggedUser != undefined) {
            var elements = $(".show-if-logged");
            for(var i = 0; i < elements.length; i++) {
                $(elements[i]).show();
            }
        }
    });
}

function showElementsIfAdmin() {
    getWhoAmI(function(data) {
        var loggedUser = data.responseJSON;
        // if there is not logged user
        if(loggedUser != undefined && isAdmin(loggedUser)) {
            var elements = $(".show-if-admin");
            for(var i = 0; i < elements.length; i++) {
                $(elements[i]).show();
            }
        }
    });
}


/**
 * Показва съответните елементи, в зависимост от authentication-а
 * За цента, елементите трябва да имат задължително клас .depend-on-authentication и .show-if-not-logged, .show-if-logged, .show-if-admin
 */
function showHideElementsDependOnAuthentication() {
    showElementsIfNotLogged();
    showElementsIfLogged();
    showElementsIfAdmin();
}

$(document).ready(function() {
    showHideElementsDependOnAuthentication();

    getWhoAmI(function(data) {
        var loggedUser = data.responseJSON;
        // if there is logged user
        if(loggedUser != undefined) {
            $("#loggedUserLabel").text(loggedUser.username);
        }
    });
});