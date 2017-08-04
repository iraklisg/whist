/**
 * IMPORTANT when we are running SuperAgent we must not have express server running
 * or else we are getting a Uncaught Error: listen EADDRINUSE :::3000
 */

const request = require('supertest');
const {expect} = require('chai');

const {app} = require('../app');

describe('Home Page', () => {
    it('should return hello world response', (done) => {
        request(app)
            .get('/')
            .expect(200)
            .expect((res) => { // res is the http response
                expect(res.body).to.include({message: 'Hello world!'}); // use the chai assertion library
            })
            .end((err, res) => {
                if (err) done(err);
                done();
            });
    });
});