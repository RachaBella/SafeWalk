var mongoose = require('mongoose');


mongoose.connect( process.env.MONGOLAB_URI ||
                      process.env.MONGOHQ_URL || 
                      'mongodb://localhost/SafeWalk')
//Lets connect to our database using the DB server URL.

module.exports.User= require("./users.js");