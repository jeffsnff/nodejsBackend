const express = require('express');
const authRouter = express.Router();
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');


authRouter.post('/signup', (req, res, next) => {
		// Check if the username already exist
		User.findOne({username: req.body.username}, (err, user) => {
			console.log("fired in User.findOne")
				// Something went wrong with the server / request
				
        if(err){
            res.status(500);
            return next(err);
        }
        // If the user does exist 
        if(user !== null){
            res.status(400);
            return next(new Error('That username is already taken'))
				}

				// If not taken, save username in database
				const newUser = new User(req.body);
				newUser.save((err, savedUser) => {

					if(err){
						res.status(500);
						return next(err)
					}
					
					// Generate a token
					const token = jwt.sign(savedUser.withoutPassword(), process.env.SECRET);
          console.log(`%%%%%%%%%%%%%%%%%% ${token} %%%%%%%%%%%%%%%%%%%%%%%%`)
					// send the response with users info and token
					return res.status(201).send({user: savedUser.withoutPassword(), token})
				})
    });
});

// Login 
authRouter.post('/login', (req, res, next) => {
	User.findOne({ username: req.body.username.toLowerCase()}, (err, user) => {

		if(err){
			res.status(500)
			return next(err)
		}

		// Does the user already exist?
		if(!user){
			res.status(400)
			return next(new Error("Username or Password is incorrect!"))
		}

		// Does the users password match the saved password?
		user.checkPassword(req.body.password, (err, isMatch) => {
			if(err){
				res.status(500)
				return next(err)
			}
			if(!isMatch){
				res.status(401)
				return next( new Error("Username or Password did not match"))
			}
			// Generate a token
			const token = jwt.sign(user.withoutPassword(), process.env.SECRET);

			// send the response with users info and token
			return res.status(201).send({user: user.withoutPassword(), token})
		})
	})
	
})

module.exports = authRouter;
