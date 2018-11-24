const _        = require('lodash');

const bcrypt   = require('bcrypt'),
      mongoose = require('mongoose');
      jwt      = require('jsonwebtoken'),
      User     = require('../models/user');
     

exports.userSignup = (req, res) => {
    const {email, password, name} = _.pick(req.body, ['email', 'password', 'name']);
    User.findOne({email: email})
    .then(foundEmail => {
        if(foundEmail) {
            return res.status(409).json({
                message: 'User already exists'
            });
        }
        return bcrypt.hash(password, 12)
        .then(hashedPassword => {
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: email,
                    password: hashedPassword,
                    name: name
                });
                user.save()
                .then(user => {
                    res.status(201).json({
                        userInfo: user,
                        message: 'User created successfully'
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}


exports.postLogin = (req, res) => {
    const {email, password} = _.pick(req.body, ['email', 'password']);
    
    User.findOne({email: email})
    .then(found => {
        if(!found) {
            return res.status(409).json({
                email: email,
                message: 'No account exists with the given email id'
            });
        }
        bcrypt.compare(password, found.password, (err, user) => {
            if(err) {
                res.status(409).json({
                    email: email,
                    err: err,
                    message: 'Passwords don\'t match'
                });
            }
            const token = jwt.sign({
                email: email,
                userId: user._id
            }, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {expiresIn: '24h'});
    
            return res.status(201).json({
                token: token,
                message: 'Auth Successful, token valid for 24hr'
            });
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.deleteUser = (req, res) => {
    User.findByIdAndRemove({_id: req.params.userId})
    .then(deletedUser => {
        res.status(201).json({
            user: deletedUser.email,
            message: 'Successfully deleted user'
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    })
}