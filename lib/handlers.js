/*
* Request handlers
*
*/

// Dependencies
const _data = require('./data');
const helpers = require('./helpers');

// Define the handlers
var handlers = {};

// Users
handlers.users = (data,callback) => {
    var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._users[data.method](data,callback);

    }else{
        callback(405);
    }

};

// Container for the users subMethods
handlers._users = {};

// Users - post
// Require data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = (data,callback)=>{
    // Check that all required fields are filled out
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 10 ? data.payload.password.trim() : false;
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if(firstName && lastName && password && tosAgreement){
        // Make sure that the user doesn't already exist
        _data.read('users',phone,(err,data)=>{
            if(err){
                // Hash the password
                var hashedPassword = helpers.hash(password);
                
                // Create the user object
                if(hashedPassword){
                    var userObject = {
                        'firstName': firstName,
                        'lastName': lastName,
                        'phone': phone,
                        'hashedPassword': hashedPassword,
                        'tosAgreement': tosAgreement
                    };
    
                    // Store the user
                    _data.create('users',phone,userObject,(err)=>{
                        if(!err){
                            callback(200);
                        }else{
                            console.log(err);
                            callback(500, {'Error': 'A user with that phone number already exists'});
                        }
                    });
                }else{
                    callback(500, {'Error': 'Could not hash the user\'s password'});
                }
               
            }else{
                // User already exists
                callback('400',{'Error' : 'A user with that phone number already exists'});
            }
        });

    }else{
        callback(400, {'Error': 'Missing required fields'});
    }
};

// Users - get
// Required data: phone
// Optional data: none
// @TODO Only let an authenticated user access their object. Don't let them access anyone else's
handlers._users.get = (data,callback)=>{
    // Check that the phone number is valid
    var phone = typeof(data.queryStringObject.get('phone')) == 'string' && data.queryStringObject.get('phone').trim().length == 10 ? data.queryStringObject.get('phone').trim() : false;
    if(phone){
        // Lookup the user
        _data.read('users',phone,(err,data)=>{
            if(!err && data){
                // Remove the hashed password from the user object before returning it to the requester
                delete data.hashedPassword;
                callback(200, data);
            }else{
                callback(404);
            }
        });
    }else{
        callback(400, {'Error': 'Missing required field'});
    }
};

// Users - put
handlers._users.put = (data,callback)=>{


};

// Users - delete
handlers._users.delete = (data,callback)=>{


};

// Ping handler
handlers.ping = function(data, callback){
    callback(200, '');
};

// Not found handler
handlers.notFound = function(data, callback){
      // Callback a http status code and a payload object
      callback(404, '');
};

handlers.sampleUpdate = (data,callback)=>{

        _data.update('test','First',{'why':'This is change'},(err)=>{
            if(!err){
                callback(200);
            }else{
                callback(500);
            }
        });
};

handlers.sampleWrite = (data,callback)=>{
        // Lookup the user
        _data.create('test','First',{'hello':'simpledata'},(err)=>{
            if(!err){
                callback(200);
            }else{
                callback(500);
            }
        });
};


// Export the module
module.exports = handlers;