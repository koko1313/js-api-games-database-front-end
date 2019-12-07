class Requests {

    /**
     * @param {String} method 
     * @param {String} url 
     * @param {Object} data 
     * @param {Function} callback 
     */
    static ajax(method, url, data, callback) {
        //$("#loadingBar").show();
        $.ajax({
            method: method,
            url: Server.SERVER_URL + url,
            data: data,
            xhrFields: {withCredentials: true},
            complete: function(resp) {
                callback(resp);
            }
        });
    }

    /**
     * @param {String} method
     * @param {String} url 
     * @param {FormData} data 
     * @param {Function} callback 
     */
    static ajaxForm(method, url, data, callback) {
        $.ajax({
            method: method,
            url: Server.SERVER_URL + url,
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            enctype: 'multipart/form-data',
            xhrFields: {withCredentials: true},
            complete: function(resp) {
                callback(resp);
            }
        });
    }
}