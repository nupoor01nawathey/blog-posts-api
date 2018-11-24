const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    let post = {
        author: 'Nupoor',
        title: 'First Post',
        content: 'This is the first post!',
        createdAt: new Date().toISOString()
    };
    res.status(201).json({
        message: 'Post created successfully',
        post: {
            post
        }
    })
}

exports.postPost = (req, res, next) => {
    const title   = req.body.title,
          content = req.body.content;

    // const errors = validationResult(req);
    // console.log(errors);
    // if(!errors.isEmpty()) {
    //     return res.status(422).json({
    //         message: 'Validation Error',
    //         errors: errors.array(),
    //         customMessage: 'Please check the length of either title or content!'
    //     })
    // }

    console.log(req.file);
    
    const post = new Post({
            title: title,
            content: content,
            creator: 'Nupoor',
            imageUrl: req.file.destination + req.file.filename
    });
    post.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Post created successfully',
            post: result
        });
    })
    .catch(err => console.log(err));
}

exports.getSinglePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
    .then( post => {
        if(!post) {
            res.status(401).json({
                message: 'Could not find post in the database',
                postId: postId
            });
        }
        res.status(201).json({
            message: 'Post found',
            post: {
                post
            }
        })
    })
    .catch(err => console.log(err));
}

exports.putSinglePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findByIdAndUpdate({_id: postId}, {$set: req.body})
    .then((old) => {
        //console.log('old :=> ', old);
        Post.findById(postId)
        .then( updated => {
            //console.log('new :=> ', updated);
            res.status(201).json({
                message: 'Updated post',
                post: {
                    updated
                }
            })
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;

    Post.findOneAndDelete(postId)
    .then(post => {
        res.status(201).json({
            message: 'Deleted post',
            post: {
                post
            }
        })
    })
    .catch(err => console.log(err));
}