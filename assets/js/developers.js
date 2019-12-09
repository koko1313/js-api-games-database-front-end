function clearResults() {
    // клонираме си шаблона
    var resultTemplate = $("#resultTemplate").clone();
    
    // изчистваме
    $("#results").html("");
    
    // поставяме си обратно шаблоните
    $("#results").append(resultTemplate);
}

function showResult(resp) {
    var developers = resp.responseJSON;
    for(var i=0; i<developers.length; i++) {
        var htmlResult = $("#resultTemplate").clone();
        htmlResult.removeAttr("id");

        var developer = developers[i];

        // платформа
        htmlResult.find(".developer-name").text(developer.name);
        htmlResult.find(".developer-description").text(developer.description);
        htmlResult.find(".developer-edit").attr("onClick", "editDeveloper("+ developer.id +")");
        htmlResult.find(".developer-delete").attr("onClick", "deleteDeveloper("+ developer.id +")");

        htmlResult.show();
        $("#results").append(htmlResult);
    }
}

function search() {
    clearResults();
    Requests.ajax("GET", "/developer/all", null, showResult);
}

// ########################################################################

function insertDeveloper() {
    var data = {
        name: $("#developerInputName").val(),
        description: $("#developerInputDescription").val()
    };

    DatabaseOperations.insert("/developer/insert", data);
}

function editDeveloper(id) {
    Requests.ajax("GET", "/developer", {id: id}, function(resp) {
        switch(resp.status) {
            case 200: 
                $("#developerInputId").val(resp.responseJSON.id);
                $("#developerInputName").val(resp.responseJSON.name);
                $("#developerInputDescription").val(resp.responseJSON.description);
                $("#insertDeveloperButton").hide();
                $("#updateDeveloperButton").show();
                $("#formModal").modal("show");
                break;
            case 404:
                alert("Разработчика не беше намерен!");
                break;
        }
    });
}

function updateDeveloper() {
    var data = {
        id: $("#developerInputId").val(),
        name: $("#developerInputName").val(),
        description: $("#developerInputDescription").val()
    };

    DatabaseOperations.update("/developer/update", data);
}

function deleteDeveloper(id) {
    DatabaseOperations.delete("/developer/delete", id);
}


// ########################################################################


$(document).ready(function() {
    search();

    // override modal close event
    $('#formModal').on('hidden.bs.modal', function () {
        $("#developerInputId").val("");
        $("#developerInputName").val("");
        $("#developerInputDescription").val("");
        $("#insertDeveloperButton").show();
        $("#updateDeveloperButton").hide();
    });
});