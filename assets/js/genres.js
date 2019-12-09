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
    var data = {name: $("#genreInputName").val()};
    DatabaseOperations.insert("/genre/insert", data);
}

function editGenre(id) {
    Requests.ajax("GET", "/genre", {id: id}, function(resp) {
        switch(resp.status) {
            case 200: 
                $("#genreInputId").val(resp.responseJSON.id);
                $("#genreInputName").val(resp.responseJSON.name);
                $("#insertGenreButton").hide();
                $("#updateGenreButton").show();
                $("#formModal").modal("show");
                break;
            case 404:
                alert("Жанра не беше намерен!");
                break;
        }
    });
}

function updateGenre() {
    var data = {
        id: $("#genreInputId").val(),
        name: $("#genreInputName").val()
    };

    DatabaseOperations.update("/genre/update", data);
}

function deleteGenre(id) {
    DatabaseOperations.delete("/genre/delete", id);
}


// ########################################################################


$(document).ready(function() {
    search();

    // override modal close event
    $('#formModal').on('hidden.bs.modal', function () {
        $("#genreInputId").val("");
        $("#genreInputName").val("");
        $("#insertGenreButton").show();
        $("#updateGenreButton").hide();
    });
});