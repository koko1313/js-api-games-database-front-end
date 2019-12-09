class DatabaseOperations {

    /**
     * Insert data into database by calling endpoint
     * @param {String} url path to the insert endpoint
     * @param {Object} data
     */
    static insert(url, data) {
        Requests.ajax("POST", url, data, function(resp) {
            switch(resp.status) {
                case 201: 
                    $("#formModal").modal("hide");
                    search();
                    break;
                case 409:
                    alert("Вече има такъв запис!");
                    break;
                case 404:
                    alert("Нещо се обърка!");
                    break;
            }
        });
    }

    /**
     * Insert form data into database by calling endpoint
     * @param {String} url path to the insert endpoint
     * @param {FormData} data
     */
    static insertFormData(url, data) {
        Requests.ajaxForm("POST", url, data, function(resp) {
            switch(resp.status) {
                case 201: 
                    $("#formModal").modal("hide");
                    search();
                    break;
                case 409:
                    alert("Вече има такъв запис!");
                    break;
                case 404:
                    alert("Нещо се обърка!");
                    break;
            }
        });
    }

    /**
     * Update entity into database
     * @param {String} url path to the update endpoint
     * @param {Object} data 
     */
    static update(url, data) {
        Requests.ajax("PUT", url, data, function(resp) {
            switch(resp.status) {
                case 200: 
                    $("#formModal").modal("hide");
                    search();
                    break;
                case 409:
                    alert("Има запис с това име!");
                    break;
                case 404:
                    alert("Записът, койко се опитвате да редактирате не беше намерен!");
                    break;
            }
        });
    }

    /**
     * Update entity into database with data of type FormData
     * @param {String} url path to the update endpoint
     * @param {FormData} data 
     */
    static updateFormData(url, data) {
        Requests.ajaxForm("PUT", url, data, function(resp) {
            switch(resp.status) {
                case 200: 
                    $("#formModal").modal("hide");
                    search();
                    break;
                case 409:
                    alert("Има запис с това име!");
                    break;
                case 404:
                    alert("Записът, койко се опитвате да редактирате не беше намерен!");
                    break;
            }
        });
    }

    /**
     * Delete entity from database
     * @param {String} url path to the delete endpoint
     * @param {int} id
     */
    static delete(url, id) {
        if(!confirm("Сигурни ли сте?")) return;
    
        Requests.ajax("DELETE", url, {id: id}, function(resp) {
            switch(resp.status) {
                case 200:
                    search();
                    break;
                case 404:
                    alert("Записът, който се опитвате да изтриете не беше намерен!");
                    break;
            }
        });
    }

}