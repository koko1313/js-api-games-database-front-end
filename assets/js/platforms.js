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
    var data = {name: $("#platformInputName").val()};
    DatabaseOperations.insert("/platform/insert", data);
}

function editPlatform(id) {
    Requests.ajax("GET", "/platform", {id: id}, function(resp) {
        switch(resp.status) {
            case 200: 
                $("#platformInputId").val(resp.responseJSON.id);
                $("#platformInputName").val(resp.responseJSON.name);
                $("#insertPlatformButton").hide();
                $("#updatePlatformButton").show();
                $("#formModal").modal("show");
                break;
            case 404:
                alert("Платформата не беше намерена!");
                break;
        }
    });
}

function updatePlatform() {
    var data = {
        id: $("#platformInputId").val(),
        name: $("#platformInputName").val()
    };

    DatabaseOperations.update("/platform/update", data);
}

function deletePlatform(id) {
    DatabaseOperations.delete("/platform/delete", id);
}


// ########################################################################


$(document).ready(function() {
    search();

    // override modal close event
    $('#formModal').on('hidden.bs.modal', function () {
        $("#platformInputId").val("");
        $("#platformInputName").val("");
        $("#insertPlatformButton").show();
        $("#updatePlatformButton").hide();
    });
});