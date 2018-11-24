const express  = require('express'),
        multer = require('multer');

const router  = express.Router();

const checkAuth = require('../middleware/checkAuth'),
      feedController = require('../controller/feed');


// multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const sizeLimits = {
    fileSize: 1024 * 1024 * 10
}

const fileFilter = (req, file, cb) => {
    if( file.mimetype === 'image/png'  || 
        file.mimetype === 'image/jpeg' || 
        file.mimetype === 'image/jpg' ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const uploads = multer({ 
    storage: storage, 
    limits: sizeLimits, 
    fileFilter: fileFilter
}); 


// /feed/posts
router.get('/posts', feedController.getPosts);

router.post('/post', checkAuth, uploads.single('image'), feedController.postPost);

router.get('/post/:postId', feedController.getSinglePost);

router.put('/post/:postId', checkAuth, feedController.putSinglePost);

router.delete('/post/:postId', checkAuth, feedController.deletePost);

module.exports = router;