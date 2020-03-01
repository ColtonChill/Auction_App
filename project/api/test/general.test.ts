import { server } from '../src/Index';
import 'mocha';

import * as chai from 'chai';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);

import { request, expect } from 'chai';

describe('routes : index', () => {

    after(() => Promise.resolve(server.close()));

    describe('GET /', () => {
        it('should respond', (done) => {
            request(server)
                .get('/')
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res.status).to.eql(200);
                    expect(res.type).to.eql('application/json');
                    expect(res.body.status).to.eql('OK');
                    done();
                });
        });
    });

});