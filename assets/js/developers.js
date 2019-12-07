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
    var developerName = $("#developerInputName").val();
    var developerDescription = $("#developerInputDescription").val();

    Requests.ajax("POST", "/developer/insert", {name: developerName, description: developerDescription}, function(resp) {
        switch(resp.status) {
            case 201: 
                $("#developerFormModal").modal("hide");
                search();
                break;
            case 409:
                alert("Има платформа с това име!");
                break;
            case 404:
                alert("Нещо се обърка");
                break;
        }
    });
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
                $("#developerFormModal").modal("show");
                break;
            case 404:
                alert("Разработчика не беше намерен!");
                break;
        }
    });
}

function updateDeveloper() {
    var developerId = $("#developerInputId").val();
    var developerName = $("#developerInputName").val();
    var developerDescription = $("#developerInputDescription").val();

    var data = {
        id: developerId,
        name: developerName,
        description: developerDescription
    };

    Requests.ajax("PUT", "/developer/update", data, function(resp) {
        switch(resp.status) {
            case 200: 
                $("#developerFormModal").modal("hide");
                search();
                break;
            case 409:
                alert("Има разработчик с това име!");
                break;
            case 404:
                alert("Разработчикът, койко се опитвате да редактирате не беше намерен!");
                break;
        }
    });
}

function deleteDeveloper(id) {
    if(!confirm("Сигурни ли сте?")) return;

    Requests.ajax("DELETE", "/developer/delete", {id: id}, function(resp) {
        switch(resp.status) {
            case 200:
                search();
                break;
            case 404:
                alert("Разработчикът, който се опитвате да изтриете не беше намерен!");
                break;
        }
    });
}


// ########################################################################


$(document).ready(function() {
    search();

    // override modal close event
    $('#developerFormModal').on('hidden.bs.modal', function () {
        $("#developerInputId").val("");
        $("#developerInputName").val("");
        $("#developerInputDescription").val("");
        $("#insertDeveloperButton").show();
        $("#updateDeveloperButton").hide();
    });
});