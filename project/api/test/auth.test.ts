import 'mocha';
import chai,{expect} from "chai";
import cap from 'chai-as-promised';
import chttp from 'chai-http';

//var chaid = require('chai');
//var chaiHttp = require('chai-http');
//var should = chai.should();
//var expect = chai.expect;

//docker-compose run api npm run test


chai.use(chttp);
chai.use(cap);

//Change this to change where the requests go to.
var server = 'http://localhost/api/v1/auth';
var fname = 'Bat';
var lname = 'Man';
var login = "Bruce.wayne@example.com";
var loginp = 'iambatman';


describe("API : Authorization", function(){
    /*beforeEach(async () =>{

    })

    afterEach(async () =>{

    });*/

    it('Should be able to reach the api', function(done){
        chai.request(server)
        .get('/')
        .end(function(err, res){
            expect(res).to.have.status(200);
            done();
        });
        
    });
    
/*
    it("Should be able to register a user", async (done) =>{
        chai.request(server)
        .post('/register')
        .send({'fname': fname, 'lname': lname, 'email': login, 'password' : loginp})
        .end(async (err, res)=>{
            expect(res).to.have.status(200);
            done();
        })

    });

    it("Should be able to log in a user", async (done) =>{
        chai.request(server)
        .post('/login')
        .send({'username': login, 'password' : loginp})
        .end(async (err,res) =>{
            expect(res).to.have.status(200);
            done();
        })


    });*/
    it("Should be able to logout a user", async ()=>{

    })
});