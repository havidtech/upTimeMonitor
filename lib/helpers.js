/*
* Helpers for various tasks
*
*/

// Dependencies
const crypto = require('crypto');
const config = require('./config')
const https = require('https');
const querystring = require('querystring');

// Container for all the helpers
var helpers = {};

// Crate a SHA256 hash
helpers.hash = (str)=>{
    if(typeof(str) == 'string' && str.length > 0){
        var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        return hash;
    }else{
        return false;
    }
};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject  = (str)=>{
    try{
        var obj = JSON.parse(str);
        return obj;

    }catch(e){
        return {};
    }

};

// Create a string of random alphanumeric characters, of a given lenght
helpers.createRandomString = (strlength)=>{
    strlength = typeof(strlength) == 'number' && strlength > 0 ? strlength : false;
    if(strlength){
        // Define all the possible characters that could go into a string
        var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

        // Start the final string
        var str = '';
        for(i = 1; i <= strlength; i++){
            // Get a random character from the possibleCharacters strings
            var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            // Append this character to the final string
            str+=randomCharacter;
        }

        // Return the final string
        return str;
    }
};


// Send sms
helpers.sendSms = (phone,msg,callback)=>{
    // Validate parameters
    phone = typeof(phone) == 'string' && phone.trim().length == 13 ? phone.trim() : false;
    msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.length <= 1600 ? msg.trim() : false;

    if(phone && msg){
        const payload = {
            'api_token': config.smsParams.token,
            'to': phone,
            'from': config.smsParams.senderId,
            'body': msg
        };

        // Add payload to searchParam
        const url = new URL("https://www.bulksmsnigeria.com/api/v1/sms/create");
        Object.keys(payload)
            .forEach(key => url.searchParams.append(key, payload[key]));
            
        // Instantiate the request object
        const req = https.request(url,requestDetails, (res) => {
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);
            // Grab the status of the request
            var status = res.statusCode;
            // Callback successfully if the request went through
            if(status == 200){
                callback(false);
            }else{
                callback(`Status code returned is:  ${status}`);
            }
        });
        
        // Bind to the error event so it doesn't get thrown
        req.on('error', (e) => {
            callback("Error with Request itself: "+e);
        });

        // End the request
        req.end();
    }else{
        callback('Given parameters were missing or invalid');
    }

  
};






















// Export the module
module.exports = helpers;