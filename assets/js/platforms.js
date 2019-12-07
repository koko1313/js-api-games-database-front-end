function clearResults() {
    // клонираме си шаблона
    var resultTemplate = $("#resultTemplate").clone();
    
    // изчистваме
    $("#results").html("");
    
    // поставяме си обратно шаблоните
    $("#results").append(resultTemplate);
}

function showResult(resp) {
    var platforms = resp.responseJSON;
    for(var i=0; i<platforms.length; i++) {
        var htmlResult = $("#resultTemplate").clone();
        htmlResult.removeAttr("id");

        var platform = platforms[i];

        // платформа
        htmlResult.find(".platform-name").text(platform.name);
        htmlResult.find(".platform-edit").attr("onClick", "editPlatform("+ platform.id +")");
        htmlResult.find(".platform-delete").attr("onClick", "deletePlatform("+ platform.id +")");

        htmlResult.show();
        $("#results").append(htmlResult);
    }
}

function search() {
    clearResults();
    Requests.ajax("GET", "/platform/all", null, showResult);
}

// ########################################################################

function insertPlatform() {
    var platformName = $("#platformInputName").val();

    Requests.ajax("POST", "/platform/insert", {name: platformName}, function(resp) {
        switch(resp.status) {
            case 201: 
                $("#platformFormModal").modal("hide");
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

function editPlatform(id) {
    Requests.ajax("GET", "/platform", {id: id}, function(resp) {
        switch(resp.status) {
            case 200: 
                $("#platformInputId").val(resp.responseJSON.id);
                $("#platformInputName").val(resp.responseJSON.name);
                $("#insertPlatformButton").hide();
                $("#updatePlatformButton").show();
                $("#platformFormModal").modal("show");
                break;
            case 404:
                alert("Платформата не беше намерена!");
                break;
        }
    });
}

function updatePlatform() {
    var platformId = $("#platformInputId").val();
    var platformName = $("#platformInputName").val();

    Requests.ajax("PUT", "/platform/update", {id: platformId, name: platformName}, function(resp) {
        switch(resp.status) {
            case 200: 
                $("#platformFormModal").modal("hide");
                search();
                break;
            case 409:
                alert("Има платформа с това име!");
                break;
            case 404:
                alert("Платформата, която се опитвате да редактирате не беше намерена!");
                break;
        }
    });
}

function deletePlatform(id) {
    if(!confirm("Сигурни ли сте?")) return;

    Requests.ajax("DELETE", "/platform/delete", {id: id}, function(resp) {
        switch(resp.status) {
            case 200:
                search();
                break;
            case 404:
                alert("Платформата, която се опитвате да изтриете не беше намерена!");
                break;
        }
    });
}


// ########################################################################


$(document).ready(function() {
    search();

    // override modal close event
    $('#platformFormModal').on('hidden.bs.modal', function () {
        $("#platformInputId").val("");
        $("#platformInputName").val("");
        $("#insertPlatformButton").show();
        $("#updatePlatformButton").hide();
    });
});