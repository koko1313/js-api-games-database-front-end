function clearResults() {
    // клонираме си шаблона
    var resultTemplate = $("#resultTemplate").clone();
    
    // изчистваме
    $("#results").html("");
    
    // поставяме си обратно шаблоните
    $("#results").append(resultTemplate);
}

function showResult(resp) {
    var genres = resp.responseJSON;
    for(var i=0; i<genres.length; i++) {
        var htmlResult = $("#resultTemplate").clone();
        htmlResult.removeAttr("id");

        var genre = genres[i];

        // платформа
        htmlResult.find(".genre-name").text(genre.name);
        htmlResult.find(".genre-edit").attr("onClick", "editGenre("+ genre.id +")");
        htmlResult.find(".genre-delete").attr("onClick", "deleteGenre("+ genre.id +")");

        htmlResult.show();
        $("#results").append(htmlResult);
    }
}

function search() {
    clearResults();
    Requests.ajax("GET", "/genre/all", null, showResult);
}

// ########################################################################

function insertGenre() {
    var genreName = $("#genreInputName").val();

    Requests.ajax("POST", "/genre/insert", {name: genreName}, function(resp) {
        switch(resp.status) {
            case 201: 
                $("#genreFormModal").modal("hide");
                search();
                break;
            case 409:
                alert("Има жанр с това име!");
                break;
            case 404:
                alert("Нещо се обърка");
                break;
        }
    });
}

function editGenre(id) {
    Requests.ajax("GET", "/genre", {id: id}, function(resp) {
        switch(resp.status) {
            case 200: 
                $("#genreInputId").val(resp.responseJSON.id);
                $("#genreInputName").val(resp.responseJSON.name);
                $("#insertGenreButton").hide();
                $("#updateGenreButton").show();
                $("#genreFormModal").modal("show");
                break;
            case 404:
                alert("Жанра не беше намерен!");
                break;
        }
    });
}

function updateGenre() {
    var genreId = $("#genreInputId").val();
    var genreName = $("#genreInputName").val();

    Requests.ajax("PUT", "/genre/update", {id: genreId, name: genreName}, function(resp) {
        switch(resp.status) {
            case 200: 
                $("#genreFormModal").modal("hide");
                search();
                break;
            case 409:
                alert("Има жанр с това име!");
                break;
            case 404:
                alert("Жанрът, който се опитвате да редактирате не беше намерен!");
                break;
        }
    });
}

function deleteGenre(id) {
    if(!confirm("Сигурни ли сте?")) return;

    Requests.ajax("DELETE", "/genre/delete", {id: id}, function(resp) {
        switch(resp.status) {
            case 200:
                search();
                break;
            case 404:
                alert("Жанрът, който се опитвате да изтриете не беше намерен!");
                break;
        }
    });
}


// ########################################################################


$(document).ready(function() {
    search();

    // override modal close event
    $('#genreFormModal').on('hidden.bs.modal', function () {
        $("#genreInputId").val("");
        $("#genreInputName").val("");
        $("#insertGenreButton").show();
        $("#updateGenreButton").hide();
    });
});