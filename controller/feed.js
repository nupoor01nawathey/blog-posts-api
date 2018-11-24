const _    = require('lodash'),
      Post = require('../models/post'),
      User = require('../models/user');

exports.getPosts = (req, res, next) => {
    Post.find()
    .then(allPosts => {   
        res.status(201).json({
            message: 'Post created successfully',
            post: {
                allPosts
            }
        });
    })
    .catch(err => console.log(err));
}

exports.postPost = (req, res, next) => {
    const {title, content} = _.pick(req.body, ['title', 'content']);
    const post = new Post({
            title: title,
            content: content,
            creator: req.userData.email,
            imageUrl: req.file.destination + req.file.filename
    });
    User.findOneAndUpdate({ email: req.userData.email }, {$push: { post: post }})
    .then(() => {
        post.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Post created successfully',
                post: result
            });
        })
        .catch(err => console.log(err));
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
