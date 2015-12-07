var mongoose = require("mongoose");
var Schema   = mongoose.Schema;
var bcrypt = require("bcryptjs");

var userSchema= new Schema ({
	username: String,
	email: {
		type:String,
		require:true,
		unique:true
	},
	password_digest: String,
	safeLocationLat: {
		type:String,
		require:true
	},
	safeLocationLong: {
		type:String,
		require:true
	},
	relativesPhoneNumber:{
		type:String,
		require:true
	}
});

userSchema.statics.createSecure = function (userName, email, password, safeLocationLat, safeLocationLong, number, callback) {
	var user= this;
	bcrypt.genSalt(function (err, salt) {
	    bcrypt.hash (password, salt, function (err, hash) {
		    //console.log(hash);
		        // create the new user (save to db) with hashed password
		    user.create({
		        username:userName,	
		        email: email,
		        password_digest: hash,
		        safeLocationLat:safeLocationLat,
		        safeLocationLong: safeLocationLong,
		        relativesPhoneNumber: number
		        }, callback);
		});
	});
}

userSchema.statics.updatePasswordSecure = function ( id ,password , callback) {
	var user = this;
	if (password) {
		bcrypt.genSalt(function (err, salt) {
	    bcrypt.hash (password, salt, function (err, hash) {
		    //console.log(hash);
		        // create the new user (save to db) with hashed password
		    user.findByIdAndUpdate(id, { $set : {password_digest: hash }} , callback);
		});
	});

	}
}

// authenticate user (when user logs in)
userSchema.statics.authenticate = function (password, email, callback) {
    // find user by email entered at log in
    this.findOne({email: email}, function (err, user) {
      // throw error if can't find user
      if (!user) {
        console.log('No user with email ' + email);
        callback ('wrong email', null);
      // if found user, check if password is correct
      } else if (user.checkPassword(password)) {
        callback(null, user);
      }else {
      	callback("Error: incorrect password", null);
      }
    });
  };

  // compare password user enters with hashed password (`passwordDigest`)
userSchema.methods.checkPassword = function (password) {
  // run hashing algorithm (with salt) on password user enters in order to compare with `passwordDigest`
  return bcrypt.compareSync(password, this.password_digest);
};

var User = mongoose.model('User', userSchema);
module.exports = User;