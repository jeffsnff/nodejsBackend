const express = require('express');
const postRouter = express.Router();
const Post = require('../models/post.js');

// Get All
postRouter.get('/', (req, res, next) => {
    Post.find((err, posts) => {
        if(err){
            res.status(500)
            return next(err)
        }
        return res.status(200).send(posts)
    })
})
// Get by User
postRouter.get('/user', (req, res, next) => {
    Post.find({user: req.user._id}, (err, usersPosts)=> {
        if(err){
            res.status(500)
            return next(err)
        }
        return res.status(200).send(usersPosts)
    })
})
// Post
postRouter.post('/', (req, res, next) => {
    // add the user ID first 
    req.body.user = req.user._id
    // then create the post
    const newPost = new Post(req.body);
    // then save it
    newPost.save((err, savedPost) => {
        if(err){
            res.status(500)
            return next(err)
        }
        return res.status(201).send(savedPost)
    })
})



module.exports = postRouter;