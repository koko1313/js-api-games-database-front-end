var loggedUser;

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
                //location.href = "index.html";
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
        method: "GET",
        url: SERVER_URL + "/logout-user",
        xhrFields: {withCredentials: true},
        complete: function(data) {
            console.log(data.responseJSON);
        }
    });
}

function getWhoAmI() {
    $.ajax({
        method: "GET",
        url: SERVER_URL + "/getWhoAmI",
        xhrFields: {withCredentials: true},
        complete: function(data) {
            console.log(data.responseJSON);
        }
    });
}

$(document).ready(function() {
    //getWhoAmI();
});