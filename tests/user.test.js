const expect     = require('chai').expect,
      request    = require('supertest'),      
    //   mongoose   = require('mongoose'),
    //   bcrypt     = require('bcrypt');
    //   jwt        = require('jsonwebtoken'),
      {ObjectID} = require('mongodb');

const {app, server}  = require('../app'),
      {User}         = require('../models/user'),
      {Post}         = require('../models/post');

const userOneObjId = new ObjectID();
const userTwoObjId = new ObjectID();

let dummyUsers = [
    {
        _id: userOneObjId,

        email: 'kyles@ks.com',
        password: 'dummypassword',
        name: 'Kyle Simpson'
    },
    {
        _id: userTwoObjId,
        email: 'patrik@cc.com',
        password: 'testpassword',
        name: 'Patrick B',
    }
];

describe('GET /posts', function () {
    this.timeout(30000);
    it('should get list of posts', function (done) {
        request('http://localhost:3000')
        .get('/feed/posts')
        .set('Content-Type', 'application/json')
        .expect(200)
        .expect(function(res) {
            expect(res.body);
            expect(res.body.results).to.have.lengthOf.at.least(1);
        })
        .end(function(err, res) {
            done(err);
        });
    });
});

describe('Create dummy users in the database', () => {
    it('should insert users listed in dummyUsers', (done) => {
        request('http://localhost:8080')
        .post('/user/signup')
        .set('Content-Type', 'application/json')
        //.send(dummyUsers[0])
        .send(dummyUsers[1])
        .expect(201)
        .expect(res => {
            // console.log(res);
            expect(res.body);
            res.should.have.status(201);
            res.body.userInfo.should.be.a('object');
            res.body.userInfo.should.not.have.property('errors');
            res.body.userInfo.should.have.property('message').eql('User created successfully');
            res.body.userInfo.should.have.property('email').eql('patrik@cc.com');
            res.body.userInfo.should.have.property('name').eql('Patrick B');

        })
        .end((err, res) => {
            console.log(res);
            done(err);
        })
    });
});