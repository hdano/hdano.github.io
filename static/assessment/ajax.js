
/**
 * Wrapper for AJAX call
 */
const ajax_post = (url, data, callback) => {
    var r = new XMLHttpRequest();
    r.open("POST", url, true);
    r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200) return;
        responseData = null
        try {
            responseData = r.json()
        } catch (e) {
            responseData = r.responseText
        }
        callback(responseData)
    };
    r.setRequestHeader("Content-Type", "application/json");
    r.send(JSON.stringify(data));
}
