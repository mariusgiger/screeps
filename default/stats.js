 var stats = (function() {
    var showNotifications = true;
    var showInfo = true;
    var showDebug = true;
    
    function notify(message) {
        if(showNotifications) {
            console.log(message)
        }
    }
    
    function info(message) {
         if(showInfo) {
            console.log(message)
        }
    }
    
    function debug(message) {
        if(showDebug) {
            console.log(message)
        }
    }
    
    function error(message) {
        console.log("ERROR: "+message);
    }
    
    return {
        notify: notify,
        debug: debug,
        info: info,
        error: error
    }
 })();

module.exports = stats;