const express = require('express'),
      router  = express.Router();

const authControllers = require('../controller/auth');

router.post('/signup', authControllers.userSignup);

router.post('/login', authControllers.postLogin);

router.delete('/:userId', authControllers.deleteUser);

module.exports = router;