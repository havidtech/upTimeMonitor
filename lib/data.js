/*
* Library for storing and editing data
*
*/

// Dependencies
var fs = require('fs');
var path = require('path');
const helpers = require('./helpers');



// Container for the module ( to be exported)
var lib = {};


// Base directory of the data folder
lib.baseDir = path.join(__dirname,'/../.data/');



// Write data to a file
lib.create = (dir, file, data, callback) =>{
    // Open the file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx',(err,fileDescriptor)=>{
        if(!err && fileDescriptor){
            // Convert data to a string
            var stringData = JSON.stringify(data);


            // Write to file and close it
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if(!err){
                    fs.close(fileDescriptor, (err)=>{
                        if(!err){
                            callback(false);
                        }else{
                            callback('Error closing new file')
                        }
                    });

                }else{
                    callback('Error writing to new file');
                }

            });

        }else{
            callback('Could not create new file, it may already exist');
        }
    });
};


// REad data from a file
lib.read = (dir, file, callback)=>{
    fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf8', (err,data)=>{
        if(!err && data){
            var parsedData = helpers.parseJsonToObject(data);
            callback(false, parsedData);
        }else{
            callback(err,data);

        }

    });

};

// Update data inside a file
lib.update = (dir,file,data,callback)=>{
    // Open the file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', (err,fileDescriptor)=>{
        if(!err && fileDescriptor){
            // Convert data to a string
            var stringData = JSON.stringify(data);

                // WRite to the file and close it
                fs.writeFile(fileDescriptor, stringData, (err)=>{
                    if(!err){
                        fs.close(fileDescriptor, (err)=>{
                            if(!err){
                                callback(false);
                            }else{
                                callback('Error closing the file');
                            }
                        });
                    }else{
                        callback('Error writing to exisiting file');
                    }
                });
                fs.writeFile(fileDescriptor, JSON.stringify({'HI':'TESTING'}), (err)=>{
                    if(!err){
                        fs.close(fileDescriptor, (err)=>{
                            if(!err){
                                callback(false);
                            }else{
                                callback('Error closing the file');
                            }
                        });
                    }else{
                        callback('Error writing to exisiting file');
                    }
                });

            // // Truncate the file
            // fs.truncate(fileDescriptor, (err)=>{
            //     if(!err){
            //         // WRite to the file and close it
            //         fs.writeFile(fileDescriptor, stringData, (err)=>{
            //             if(!err){
            //                 fs.close(fileDescriptor, (err)=>{
            //                     if(!err){
            //                         callback(false);
            //                     }else{
            //                         callback('Error closing the file');
            //                     }
            //                 });
            //             }else{
            //                 callback('Error writing to exisiting file');
            //             }
            //         });
            //     }else{
            //         callback('Error truncation file');
            //     }
            // });
        }else{
            callback('Could not open the file for updating, it may not exist yet');
        }

    });

};

// Delete a file
lib.delete = (dir,file,callback)=>{
    // Unlink the file
    fs.unlink(lib.baseDir+dir+'/'+file+'.json', (err)=>{
        if(!err){
            callback(false);

        }else{
            callback('Error deleting the file');
        }
    });

};












// Export the module
module.exports = lib;