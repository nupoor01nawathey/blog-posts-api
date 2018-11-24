const express    = require('express'),
      path       = require('path'),
      mongoose   = require('mongoose'),
      multer     = require('multer'),
      bodyParser = require('body-parser');

const app = express();

const feedRoutes = require('./router/feed'),
      authRoutes = require('./router/auth');


app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Content-Allow-Methods', 'GET', 'POST', 'PUT','PATCH', 'DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Authorization');
    next();
});

app.use(express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res, next) => {
    res.render('index', {
        path: '/',
    });
})

app.use('/feed', feedRoutes);
app.use('/user', authRoutes);


const PORT = process.env.PORT || 8080;

let server;

mongoose.connect('mongodb://localhost:27017/BlogPostsRestAPI', { useNewUrlParser: true })
.then(() => {
    console.log('connected to the database');
    server = app.listen(PORT, () => {
        console.log('Server started at 3000');
    });
})
.catch(err => console.log(err));


//server.listen(80);

module.exports = {
    app,
    server
};