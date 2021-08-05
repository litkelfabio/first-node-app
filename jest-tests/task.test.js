const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');

const { user1Id, user1, setUpDB, task2, user2, task3 } = require('./fixtures/db')

beforeEach(setUpDB);

test('Should create task', async () => {
    const response = await request(app).post('/task')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send({
        description: 'Moan grass'
    }).expect(201);

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull();
    expect(task.completed).toBe(false)
});

test('Should NOT create task', async () => {
    await request(app).post('/task')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send({
        location: 'Neighbor'
    }).expect(400);
});

test('Should return the tasks of user1', async () =>{ 
    const response = await request(app).get('/tasks')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200);

    expect(response.body.length).toEqual(2);
});

test('Should NOT delete if not the owner of task', async () => {
    await request(app).delete(`/task/${task2._id}`)
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .send()
    .expect(404);
    
    const task = await Task.findById(task2._id);
    expect(task).not.toBeNull();
});

test('Should update the task by the owner', async () => {
    await request(app).patch(`/task/${task2._id}`)
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send({
        description: 'Updated'
    })
    .expect(200);

    const task = await Task.findById(task2._id);
    expect(task.description).toEqual('Updated');
});


