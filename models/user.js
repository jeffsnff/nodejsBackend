const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const userSchema = new Schema({
	username: {
			type: String,
			unique: true,
			lowercase: true,
			required: true
	},
	password:{
			type: String, 
			required: true
	},
	isAdmin: {
			type: Boolean,
			default: false
	},
	memberSince: {
			type: Date,
			default: Date.now
	}
});

	// pre-save hook to encrypt user password
	userSchema.pre("save", function(next){
		const user = this
		if(!user.isModified("password")) return next();
		bcrypt.hash(user.password, 10, (err, hash) => {
			if(err) {
				return next(err)
			}
			user.password = hash
			next()
		})
	})
	//  user method to check hashed password on login
	userSchema.methods.checkPassword = function(passwordAttempt, callback){
		bcrypt.compare(passwordAttempt, this.password, (err, isMatch) => {
			if(err){
				return callback(err)
			}
			callback(null, isMatch)
		})
	}

	// method to remove users password after successful login / sign up
	userSchema.methods.withoutPassword = function(){
		const user = this.toObject()
		delete user.password
		return user
	}


module.exports = mongoose.model('User', userSchema);

