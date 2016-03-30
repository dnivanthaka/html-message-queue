//TODO implement data type customization
//TODO implement remove functions
function Message(token, data, method, url, onsuccess, onerror){
    this.data      = data;
    this.method    = method.toUpperCase();
    this.url       = url;
    this.dataType  = 'text';
    this.onsuccess = onsuccess;
    this.onerror   = onerror;
    this.token     = token;
}

function MessageQueue(length){
    this.data = [];
    this.count = 0;
}

MessageQueue.prototype.size = function(){
    return this.count;
}
//TODO implement oncomplete function
MessageQueue.prototype.request = function(data, method, url, onsuccess, onerror = null, oncomplete = null){
    var m = new Message(this.count, data, method, url, onsuccess, onerror);
    this.data[this.count] = m;
    this.count = this.count + 1;
    
    return this.count;
}

MessageQueue.prototype.sendRequest = function(message){
    //console.log("Sending message " + message.token);
    var instance = this;
    
    $.ajax({
        type: message.method,
        url:  message.url,
        data: message.data,
        success: function(response, status){
            console.log("Success " + message.token);
            instance.onsuccess(message, response, status);
            
        },
        error: function(response, status){
            console.log("Error " + message.token);
            instance.onerror(message, response, status);
        },
        complete: function(response, status){
            console.log("Complete " + message.token);
            instance.oncomplete(message, response, status);
        },
        dataType: message.dataType
    });
}

MessageQueue.prototype.onsuccess = function(message, response, status){
    //alert("MessageQueue.prototype.onsuccess" + response + status);
    if(message.onsuccess !== null)    
        message.onsuccess(message.token, response, status);
}

MessageQueue.prototype.onerror = function(message, response, status){
    //alert("MessageQueue.prototype.onsuccess" + response + status);
    if(message.onerror !== null)    
        message.onerror(message.token, response, status);
}

MessageQueue.prototype.oncomplete = function(message, response, status){
    if(message.oncomplete !== null)    
        message.oncomplete(message.token, response, status);
}

MessageQueue.prototype.process = function(){
    var size = this.count;

    for(var i=0;i<size;i++){
        var message = this.data[i];
        //message.onsuccess(i);
        //if(message.onerror !== null)
            //message.onerror(i);
        //alert(message.url);

        
        this.sendRequest(message);
        
        this.data[i] = null;
        this.count = this.count - 1;
    }
}

