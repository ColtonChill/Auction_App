
//Jace's code
import 'mocha';
import chai, {expect} from "chai";
import cap from 'chai-as-promised';
import chttp from 'chai-http';
import { server } from '../src/Index';
import User from "../src/db/User";
import {migrate, rollback} from "../src/services/Database";
//var chaid = require('chai');
//var chaiHttp = require('chai-http');
//var should = chai.should();
//var expect = chai.expect;

//docker-compose run api npm run test


chai.use(chttp);
chai.use(cap);

//Change this to change where the requests go to.
//var server = 'http://localhost/api/v1/auth';
var fname = 'Bat';
var lname = 'Man';
var login = "Bruce.wayne@example.com";
var loginp = 'iambatman';


describe("API : Authorization", function(){
    beforeEach(async () =>{
        await migrate();
    })

    afterEach(async () =>{
        await rollback();
    });

    //At the moment these tests test only the api not necessarily the database in conjunction with the 
    it('Should be able to reach the api', function(done){
        chai.request(server)
        .get('/auth/')
        .end(function(err, res){
            expect(res).to.have.status(200);
            done();
        });
        
    });
    

    it("Should be able to register a user", function(done){
        chai.request(server)
        .post('/auth/register')
        .send({'fname': fname, 'lname': lname, 'email': login, 'password' : loginp})
        .end(function(err, res){
            expect(res).to.have.status(200);
            done();
        })

    });

    //you made it to the login screen 
    it("Should be able to log in a user", function(done){
        chai.request(server)
        .post('/auth/login')
        .send({'username': login, 'password' : loginp})
        .end(function(err,res){
            expect(res).to.have.status(200);
            done();
        })


    });
    it("Should be able to logout a user",  function(done){
        chai.request(server)
        .post('/auth/login')
        .send({'username': login, 'password' : loginp})
        .end(function(err,res){
            expect(res).to.have.status(200);
        });
        chai.request(server)
        .get('/logout')
        .end(function(err,res){
            expect(res).to.have.status(200);
            done();
        })

    })
});