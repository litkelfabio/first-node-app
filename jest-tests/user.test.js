//npm test to run test the API

const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
// const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose')

const { user1Id, user1, setUpDB } = require('./fixtures/db')

// const user1Id = new mongoose.Types.ObjectId(); // creating ID
// const user1 = {
//     _id: user1Id,
//     name: "Tester 1",
//     email: "tester1@emial.com",
//     password: "12345678",
//     tokens: [{
//         token: jwt.sign({_id : user1Id}, process.env.JWT_SECRET)
//     }]
// }



//Jest lifecycle
//It triggers before every test functions
beforeEach(setUpDB);

// afterEach(() => {

// });

test('Should sign up new user', async  () => {
    const response = await request(app).post('/user').send({
        name: "John",
        email: "foo@foo.com",
        password: "12345678"
    }).expect(201);

    //detecting/asserting if the db change correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    //assertion abt the response
    expect(response.body).toMatchObject({
        user: {
            name: "John",
            email: "foo@foo.com"
        },
        token: user.tokens[0].token
    });

    expect(user.password).not.toBe('12345678')
});

test('Should  login user', async () => {
    const response = await request(app).post('/user/login').send({
        email: user1.email,
        password: user1.password
    }).expect(200);
    
    const user = await User.findById(user1Id);
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should NOT login user', async () => {
    await request(app).post('/user/login').send({
        email: user1.email,
        password: user1.password + '2'
    }).expect(400);
});

test('Should get profile of log in user' , async () => {
    await request(app).get('/me').set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)
});

test('Should NOT get profile of log in user' , async () => {
    await request(app).get('/me')
    .send()
    .expect(401)
});

test('Should delete account', async () => {
    await request(app).delete('/user/me')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(user1Id);
    expect(user).toBeNull();
}); 

test('Should NOT delete account', async () => {
    await request(app).delete('/user/me')
    .send()
    .expect(401)
});

test('Should upload avatar', async () => {
    await request(app).post('/user/me/avatar')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .attach('avatar', 'jest-tests/fixtures/image.jpg')
    .expect(200)

    const user = await User.findById(user1Id);
    expect(user.avatar).toEqual(expect.any(Buffer))
});

test('Should update user profile', async () => {
    await request(app).patch('/user/me')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send({
        name: "kelly"
    }).expect(200)

    const user = await User.findById(user1Id);
    expect(user.name).toBe('kelly')
});

test('Should NOT update user profile', async () => {
    await request(app).patch('/user/me')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send({
        school: "CvSU"
    }).expect(400)
});
