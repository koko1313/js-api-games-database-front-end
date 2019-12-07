var PATH_TO_IMAGES;
var loggedUser;

// сетваме пътя за папката със картинките. Пътя го взимаме чрез endpoint от сървъра
Requests.ajax("GET", "/images-folder", null, function(resp) {
    resp = resp.responseText;
    PATH_TO_IMAGES = resp;
});

var resultDesign = 1;

// сетва избрания дизайн за показване на резултатите и ги визуализира по него
function setResultDesign(designNumber) {
    resultDesign = designNumber;
    clearResults();
    search();
}

// изчиства всички резултати
function clearResults() {
    // клонираме си шаблоните
    var resultTemplate1 = $("#resultTemplate1").clone();
    var resultTemplate2 = $("#resultTemplate2").clone();
    
    // изчистваме
    $("#results").html("");
    
    // поставяме си обратно шаблоните
    $("#results").append(resultTemplate1);
    $("#results").append(resultTemplate2);
}

// показва резултатите (извиква се като callback от ajax)
function showResult(resp) {
    resp = resp.responseJSON;
    // показва резултатите, спрямо дизайна, който e избран
    switch(resultDesign) {
        case 1 : showResultDesign1(resp); break;
        case 2 : showResultDesign2(resp); break;
    }

}

// показва резултата по първия дизайн
function showResultDesign1(games) {
    for(var i=0; i<games.length; i++) {
        var htmlResult = $("#resultTemplate1").clone();
        htmlResult.removeAttr("id");

        var game = games[i];

        // заглавие
        htmlResult.find('h3').text(game.name);

        // картинка
        if(game.image != null) {
            htmlResult.find('img').attr("src", PATH_TO_IMAGES + game.image);
        }

        // разработчици
        var developer = null;
        if(game.developer != null) {
            developer = game.developer.name;
        }
        htmlResult.find('.developers').text(developer);

        // жанрове
        var genres = "";
        for(var j=0; j<game.genres.length; j++) {
            if(j > 0) genres += ", "; // слагаме запетая в случай че имаме повече от 1
            genres += game.genres[j].name;
        }
        htmlResult.find('.genres').text(genres);

        // платформи
        var platforms = "";
        for(var j=0; j<game.platforms.length; j++) {
            if(j > 0) platforms += ", "; // слагаме запетая в случай че имаме повече от 1
            platforms += game.platforms[j].name;
        }
        htmlResult.find('.platforms').text(platforms);

        // описание
        htmlResult.find('.description').text(game.description);

        // добавена от
        htmlResult.find('.addedBy').text(game.addedByUser.username);

        // edit и delete бутоните
        htmlResult.find(".game-edit").attr("onClick", "editGame("+ game.id +")");
        htmlResult.find(".game-delete").attr("onClick", "deleteGame("+ game.id +")");

        // edit бутона се показва само ако логнатия потребител е добавил играта
        if(loggedUser != undefined && loggedUser.id == game.addedByUser.id) {
            htmlResult.find(".game-edit").attr("style", "display: inline !important");
        }

        htmlResult.show();
        $("#results").append(htmlResult);
    }
}

// показва резултата по втория дизайн
function showResultDesign2(games) {
    var resultCards = $("#resultTemplate2").clone();

    for(var i=0; i<games.length; i++) {
        var htmlResult = $("#resultTemplate2Card").clone();
        $(htmlResult).removeAttr("id");
        var game = games[i];

        // заглавие
        htmlResult.find('h3').text(game.name);

        // картинка
        if(game.image != null) {
            htmlResult.find('img').attr("src", PATH_TO_IMAGES + game.image);
        }

        // разработчици
        var developer = null;
        if(game.developer != null) {
            developer = game.developer.name;
        }
        htmlResult.find('.developers').text(developer);

        // жанрове
        var genres = "";
        for(var j=0; j<game.genres.length; j++) {
            if(j > 0) genres += ", "; // слагаме запетая в случай че имаме повече от 1
            genres += game.genres[j].name;
        }
        htmlResult.find('.genres').text(genres);

        // платформи
        var platforms = "";
        for(var j=0; j<game.platforms.length; j++) {
            if(j > 0) platforms += ", "; // слагаме запетая в случай че имаме повече от 1
            platforms += game.platforms[j].name;
        }
        htmlResult.find('.platforms').text(platforms);

        // описание
        htmlResult.find('.description').text(game.description);

        // добавена от
        htmlResult.find('.addedBy').text(game.addedByUser.username);

        // edit и delete бутоните
        htmlResult.find(".game-edit").attr("onClick", "editGame("+ game.id +")");
        htmlResult.find(".game-delete").attr("onClick", "deleteGame("+ game.id +")");

        // edit бутона се показва само ако логнатия потребител е добавил играта
        if(loggedUser != undefined && loggedUser.id == game.addedByUser.id) {
            htmlResult.find(".game-edit").attr("style", "display: inline !important");
        }

        htmlResult.show();
        resultCards.append(htmlResult);
    }

    resultCards.show();
    $("#results").append(resultCards);
}

// търси и показва резултатите
function search() {
    clearResults(); // когато е зададен нов параметър, трием показаните до момента резултати

    if(selectedGenres.includes(0) && selectedPlatforms.includes(0)) {
        Requests.ajax("GET", "/game/all", null, showResult);
    }
    else if(!selectedGenres.includes(0) && !selectedPlatforms.includes(0)) {
        Requests.ajax("GET", "/game/search?genres_id_list=" + selectedGenres.join(",") + "&platforms_id_list=" + selectedPlatforms.join(","), null, showResult);
    }
    else if(!selectedGenres.includes(0)) {
        Requests.ajax("GET", "/game/search?genres_id_list=" + selectedGenres.join(","), null, showResult);
    }
    else if(!selectedPlatforms.includes(0)) {
        Requests.ajax("GET", "/game/search?platforms_id_list=" + selectedPlatforms.join(","), null, showResult);
    }
}


// ########################################################################


var selectedGenres = [0];

var selectedPlatforms = [0];

// попълва филтъра с жанровете
function loadGenres() {
    Requests.ajax("GET", "/genre/all", null, function(resp) {
        var genres = resp.responseJSON;
        for(var i=0; i<genres.length; i++) {
            var genreItem = $("#genreItemTemplate").clone();
            genreItem.removeAttr("id");
            genreItem.attr("data-value", genres[i].id);
            genreItem.text(genres[i].name);

            genreItem.show();
            $("#genresModal").find(".modal-body").find("ul").append(genreItem);
        }
    });
}

// попълва филтъра с платформите
function loadPlatforms() {
    Requests.ajax("GET", "/platform/all", null, function(resp) {
        var platforms = resp.responseJSON;
        for(var i=0; i<platforms.length; i++) {
            var platformItem = $("#platformItemTemplate").clone();
            platformItem.removeAttr("id");
            platformItem.attr("data-value", platforms[i].id);
            platformItem.text(platforms[i].name);

            platformItem.show();
            $("#platformsModal").find(".modal-body").find("ul").append(platformItem);
        }
    });
}

// попълва всички филтри
function loadFilters() {
    loadGenres();
    loadPlatforms();
}

function setGenre(id) {
    id = parseInt(id);

    // ако в масива има елемент 0 го премахваме
    if(selectedGenres[0] == 0) {
        selectedGenres.pop();
    }

    // ако влезе id 0, изчистваме масива
    if(id == 0) {
        selectedGenres = [];
    }

    // ако в масива го има елемента го махаме
    if(selectedGenres.includes(id)) {
        if(selectedGenres.indexOf(id) != -1) {
            selectedGenres.splice(selectedGenres.indexOf(id), 1);
        }
    } 
    // иначе го добавяме
    else {
        selectedGenres.push(id);
    }
}

function setPlatform(id) {
    id = parseInt(id);

    // ако в масива има елемент 0 го премахваме
    if(selectedPlatforms[0] == 0) {
        selectedPlatforms.pop();
    }

    // ако влезе id 0, изчистваме масива
    if(id == 0) {
        selectedPlatforms = [];
    }

    // ако в масива го има елемента го махаме
    if(selectedPlatforms.includes(id)) {
        if(selectedPlatforms.indexOf(id) != -1) {
            selectedPlatforms.splice(selectedPlatforms.indexOf(id), 1);
        }
    } 
    // иначе го добавяме
    else {
        selectedPlatforms.push(id);
    }
}

// селектиране на жанр - извикава се когато се кликне бутона на някой жанр
function selectGenre(htmlItem) {
    var genreId = htmlItem.dataset.value;

    setGenre(genreId);

    if(genreId == 0) {
        $("#openGenresModalButton").text("Жанр (Всички)");
    } else {
        $("#openGenresModalButton").text("Жанр ("+ selectedGenres.length +")");
    }
    
    var genresItems = $(htmlItem).parent().children();

    // ако сме селектирали Всички - правим всички неактивни
    if(genreId == 0) {
        for(var i=0; i<genresItems.length; i++) {
            $(genresItems[i]).removeClass("active");
        }
        $(genresItems[0]).addClass("active");
    // иначе правим елемента "Всички" неактивен и активираме/деактивираме избрания
    } else {
        $(genresItems[0]).removeClass("active");
        $(htmlItem).toggleClass("active");
    }

    // ако нямаме нищо избрано - викаме клик евент на първия елемент, който ни е "Всики"
    if(selectedGenres.length == 0) {
        $(genresItems[0]).click();
        return;
    }

    search();
}

// селектиране на платформа - извиква се когато се кликне бутона на някоя платформа
function selectPlatform(htmlItem) {
    var platformId = htmlItem.dataset.value;

    setPlatform(platformId);

    if(platformId == 0) {
        $("#openPlatformsModalButton").text("Платформа (Всички)");
    } else {
        $("#openPlatformsModalButton").text("Платформа ("+ selectedPlatforms.length +")");
    }
    
    var platformItems = $(htmlItem).parent().children();
    // ако сме селектирали Всички - правим всички неактивни и само първия - активен
    if(platformId == 0) {
        for(var i=0; i<platformItems.length; i++) {
            $(platformItems[i]).removeClass("active");
        }
        $(platformItems[0]).addClass("active");
    // иначе правим елемента "Всички" неактивен и активираме/деактивираме избрания
    } else {
        $(platformItems[0]).removeClass("active");
        $(htmlItem).toggleClass("active");
    }

    // ако нямаме нищо избрано - викаме клик евент на първия елемент, който ни е "Всики"
    if(selectedPlatforms.length == 0) {
        $(platformItems[0]).click();
        return;
    } 

    search();
}


// ########################################################################


// попълва жанрове, платформи и разработчици за добавяне на игра
function loadInputFields() {
    loadInputGenres();
    loadInputPlatforms();
    loadInputDevelopers();
}

function loadInputGenres() {
    Requests.ajax("GET", "/genre/all", null, function(resp) {
        var genres = resp.responseJSON;
        for(var i=0; i<genres.length; i++) {
            var genreItem = $("#genreInputTemplate").clone();
            genreItem.removeAttr("id");
            genreItem.find("input").attr("id", "inputGenre" + genres[i].id);
            genreItem.find("input").attr("value", genres[i].id);
            genreItem.find("label").attr("for", "inputGenre" + genres[i].id);
            genreItem.find("label").text(genres[i].name);

            genreItem.show();
            $("#gameInputGenres").append(genreItem);
        }
    });
}

function loadInputPlatforms() {
    Requests.ajax("GET", "/platform/all", null, function(resp) {
        var platforms = resp.responseJSON;
        for(var i=0; i<platforms.length; i++) {
            var platformItem = $("#platformInputTemplate").clone();
            platformItem.removeAttr("id");
            platformItem.find("input").attr("id", "inputPlatform" + platforms[i].id);
            platformItem.find("input").attr("value", platforms[i].id);
            platformItem.find("label").attr("for", "inputPlatform" + platforms[i].id);
            platformItem.find("label").text(platforms[i].name);

            platformItem.show();
            $("#gameInputPlatforms").append(platformItem);
        }
    });
}

function loadInputDevelopers() {
    Requests.ajax("GET", "/developer/all", null, function(resp) {
        var developers = resp.responseJSON;
        for(var i=0; i<developers.length; i++) {
            var developerItem = $("#developerInputTemplate").clone();
            developerItem.removeAttr("id");
            developerItem.attr("value", developers[i].id);
            developerItem.text(developers[i].name);

            developerItem.show();
            $("#gameInputDeveloper").append(developerItem);
        }
    });
}

// ########################################################################


function insertGame() {
    var formData = new FormData();

    formData.append("name", $("#gameInputName").val());
    formData.append("image", $("#gameInputImage")[0].files[0]);
    formData.append("developer_id", $("#gameInputDeveloper").val());
    formData.append("description", $("#gameInputDescription").val());

    var genres = "";
    $.each($("input[name='gameInputGenre']:checked"), function(){
        genres += $(this).val() + ",";
    });
    genres = genres.substring(0, genres.length-1); // премахваме последната запетая

    formData.append("genres_id_list", genres);

    var platforms = "";
    $.each($("input[name='gameInputPlatform']:checked"), function(){
        platforms += $(this).val() + ",";
    });
    platforms = platforms.substring(0, platforms.length-1); // премахваме последната запетая

    formData.append("platforms_id_list", platforms);

    Requests.ajaxForm("POST", "/game/insert", formData, function(resp) {
        switch(resp.status) {
            case 201: 
                $("#gameFormModal").modal("hide");
                search();
                break;
            case 409:
                alert("Има игра с това име!");
                break;
            case 404:
                alert("Нещо се обърка");
                break;
        }
    });
}

function editGame(id) {
    Requests.ajax("GET", "/game", {id: id}, function(resp) {
        switch(resp.status) {
            case 200: 
                $("#gameInputId").val(resp.responseJSON.id);
                $("#gameInputName").val(resp.responseJSON.name);
                $("#gameInputDescription").val(resp.responseJSON.description);
                
                if(resp.responseJSON.developer) {
                    $("#gameInputDeveloper").val(resp.responseJSON.developer.id);
                }

                var genres = resp.responseJSON.genres;
                var genresCheckboxes = $("#gameInputGenres").find("input");

                // селектираме жанровете, на които съответства играта
                for(var i = 0; i < genres.length; i++) {
                    for(var j = 0; j < genresCheckboxes.length; j++) {
                        if(genres[i].id == $(genresCheckboxes[j]).val()) {
                            $(genresCheckboxes[j]).prop("checked", true);
                        }
                    }
                }

                var platforms = resp.responseJSON.platforms;
                var platformsCheckboxes = $("#gameInputPlatforms").find("input");

                // селектираме жанровете, на които съответства играта
                for(var i = 0; i < platforms.length; i++) {
                    for(var j = 0; j < platformsCheckboxes.length; j++) {
                        if(platforms[i].id == $(platformsCheckboxes[j]).val()) {
                            $(platformsCheckboxes[j]).prop("checked", true);
                        }
                    }
                }

                $("#insertGameButton").hide();
                $("#updateGameButton").show();
                $("#gameFormModal").modal("show");
                break;
            case 404:
                alert("Играта не беше намерена!");
                break;
        }
    });
}

function updateGame() {
    var gameId = $("#gameInputId").val();

    var formData = new FormData();
    
    formData.append("id", gameId);
    formData.append("name", $("#gameInputName").val());
    formData.append("image", $("#gameInputImage")[0].files[0]);
    formData.append("developer_id", $("#gameInputDeveloper").val());
    formData.append("description", $("#gameInputDescription").val());

    var genres = "";
    $.each($("input[name='gameInputGenre']:checked"), function(){
        genres += $(this).val() + ",";
    });
    genres = genres.substring(0, genres.length-1); // премахваме последната запетая

    formData.append("genres_id_list", genres);

    var platforms = "";
    $.each($("input[name='gameInputPlatform']:checked"), function(){
        platforms += $(this).val() + ",";
    });
    platforms = platforms.substring(0, platforms.length-1); // премахваме последната запетая

    formData.append("platforms_id_list", platforms);
    
    Requests.ajaxForm("PUT", "/game/update", formData, function(resp) {
        switch(resp.status) {
            case 200: 
                $("#gameFormModal").modal("hide");
                search();
                break;
            case 409:
                alert("Има игра с това име!");
                break;
            case 404:
                alert("Играта, която се опитвате да редактирате не беше намерена!");
                break;
        }
    });
}

function deleteGame(id) {
    if(!confirm("Сигурни ли сте?")) return;

    Requests.ajax("DELETE", "/game/delete", {id: id}, function(resp) {
        switch(resp.status) {
            case 200:
                search();
                break;
            case 404:
                alert("Играта, която се опитвате да изтриете не беше намерена!");
                break;
        }
    });
}

// ########################################################################


var position = $(window).scrollTop(); 
$(window).scroll(function() {

    // зарежда още резултати, когато скролнем до най-долу
    /*
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        currentPage++;
        search();
    }
    */

    var scroll = $(window).scrollTop();

    // scroll down
    if(scroll > position) {
        $("#goTopButton").fadeOut();

    // scroll up
    } else {
        $("#goTopButton").slideDown();
    }

    position = scroll;

    // скриваме "go to top" бутона, когато сме най-горе
    if(position == 0) {
        $("#goTopButton").fadeOut();
    }
});

// скролва до началото на страницата
function goToTopOfPage() {
    $("html, body").animate({ scrollTop: 0 }, "medium");
}

$(document).ready(function() {
    getWhoAmI(function(resp) {
        loggedUser = resp.responseJSON;
    });
    search();
    loadFilters();
    loadInputFields();

    // override modal close event
    $("#gameFormModal").on("hidden.bs.modal", function () {
        $("#gameInputId").val("");
        $("#gameInputName").val("");
        $("#gameInputDeveloper").val(0);
        $("#gameInputImage").val("");
        $("#gameInputDescription").val("");

        var genresCheckboxes = $("#gameInputGenres").find("input");
        for(var i = 0; i < genresCheckboxes.length; i++) {
            $(genresCheckboxes[i]).prop("checked", false);
        }

        var platformsCheckboxes = $("#gameInputPlatforms").find("input");
        for(var i = 0; i < platformsCheckboxes.length; i++) {
            $(platformsCheckboxes[i]).prop("checked", false);
        }

        $("#insertGameButton").show();
        $("#updateGameButton").hide();
    });
});