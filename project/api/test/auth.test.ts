import 'mocha';
import chai, {expect} from "chai";
import cap from 'chai-as-promised';
import chttp from 'chai-http';

var chaid = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

chaid.use(chaiHttp);
chaid.use(cap);

//Change this to change where the requests go to.
var server = 'http://localhost/api/v1/auth';

describe("API : Authorization", function(){
    /*beforeEach(async () =>{

    })

    afterEach(async () =>{

    });*/

    it('Should be able to reach the api', function(done){
        chaid.request(server)
        .get('/')
        .end(function(err, res){
            expect(res).to.have.status(200);
            done();
        });
        
    });
    it("Should be able to log in a user", async () =>{

    })

    it("Should be able to register a user", async () =>{

    });
    it("Should be able to logout a user", async ()=>{

    })
});