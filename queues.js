//TODO implement data type customization
//TODO implement remove functions
function Message(token, data, method, url, onsuccess, onerror){
    this.data       = data;
    this.method     = method.toUpperCase();
    this.url        = url;
    this.dataType   = 'text';
    this.onsuccess  = onsuccess;
    this.onerror    = onerror;
    this.oncomplete = null;
    this.token      = token;
}

function MessageQueue(){
    this.data = [];
    this.count = 0;
}

MessageQueue.prototype.size = function(){
    return this.data.length;
}
//TODO implement oncomplete function
MessageQueue.prototype.request = function(data, method, url, onsuccess, onerror = null, oncomplete = null){
    var m = new Message(this.data.length, data, method, url, onsuccess, onerror);
    //this.data[this.count] = m;
    //this.count = this.count + 1;
    this.data.push(m);
    
    return this.data.length;
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
	    //instance.data.shift();
	    //instance.count--;
            instance.onsuccess(message, response, status);
            
        },
        error: function(response, status){
            console.log("Error " + message.token + response + status);
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
    this.data.shift();
    
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
    //var size = this.count;

    for(var i=0;i<this.data.length;i++){
        var message = this.data[i];
	//var message = this.shift();
        //message.onsuccess(i);
        //if(message.onerror !== null)
            //message.onerror(i);
        //alert(message.url);

        
        this.sendRequest(message);
        //this.shift();
        //this.data[i] = null;
        this.count = this.count - 1;
    }
    
    alert(this.data.length);
    //this.data = this.data.splice(0, this.data.length);
    //this.count = 0;
	
    //this.forEach(this.sendRequest);
}

