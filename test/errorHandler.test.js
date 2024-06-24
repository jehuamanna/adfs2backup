const express = require('express');
const supertest = require('supertest');
const errorHandler = require('../src/middlewares/errorHandler');

describe('errorHandler middleware', () => {
    it('should throw error in case the server encounters an unidentified error', (done) => {
        const app = express();

        app.use(errorHandler);

        app.get('/test', (req, res) => {
            // mock error by printing a variable that does not exist.
            console.log(nonexistntvariable);

            res.sendStatus(200);
        })

        const sut = supertest(app);

        sut.get('/test').end((err, res) => {
            // ASSERT
            expect(res.statusCode).toBe(500);
            done();
        });
    });

    it('should not throw error if there is no eror', (done) => {
        const app = express();

        app.use(errorHandler);

        app.get('/test', (req, res) => {

            res.sendStatus(200);
        })

        const sut = supertest(app);

        sut.get('/test').end((err, res) => {
            // ASSERT
            expect(res.statusCode).toBe(200);
            done();
        });
    })

});

