//Author: Jace Longhurst 
const Router =  require('koa-router');
const passport = require('koa-passport');
import User from '../db/User';
const router = new Router();


//api/v1/auth

//Proof that you made it
//Not really nessecary  
router.get('/', async ctx =>{
    ctx.response.body = {'message': "Welcome to the authorization api!"};
    ctx.status = 200; 
});

//takes username and password through post and logs you in 
//make sure it is username and password and not email and password
router.post('/login', async ctx =>{
    
    ctx.request.body.username = ctx.request.body.email.toLowerCase();
    if(ctx.request.body.username === undefined || ctx.request.body.username === '' || ctx.request.body.username === null) {
        ctx.body = {'error': 'Email is required.'};
        ctx.status = 400;
        return Promise.resolve();
    }

    if(ctx.request.body.password === undefined || ctx.request.body.username === '' || ctx.request.body.username === null) {
        ctx.body = {'error': 'Password is required.'};
        ctx.status = 400;
        return Promise.resolve();
    }
    //This is where the actual authentication happens 
    return passport.authenticate('local', (err,user)=>{
        if(user){
            ctx.login(user);
            ctx.status = 200;
            ctx.body = {'status': 'OK'};
            return;
        }
        else{
            ctx.status = 401
            ctx.body = {'error': 'Failed to login with that username/password combination.'};
            return;
        }
    })(ctx);
  
});

//This will log you out, duh, nothing to pass here. 
router.get('/logout', async ctx =>{
    if(ctx.isAuthenticated()){
        ctx.logout();
        ctx.status = 200; 
    }
    else{
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
    }
});


router.get('/@me', async ctx => {
    if(ctx.isAuthenticated()) {
        ctx.body = ctx.req.user.toJson();
        ctx.status = 200;
        return Promise.resolve();
    }
    else {
        ctx.status = 401;
        return Promise.resolve();
    }
})


router.post('/register', async ctx =>{
//requires firstName, lastName, email, password

    var lenName = 255;

    //optional make it so that this is only letters
    //inside this makes sure the name is under a certain length
    if(ctx.request.body.firstName === null|| ctx.request.body.firstName === undefined){
        ctx.status = 400;
        ctx.body = {'error' : 'First name is required.'};
        //ctx.redirect('/login/failure');
        return; 
    }
    if (ctx.request.body.firstName.length > lenName) {
        ctx.status = 400;
        ctx.body = `First name must be less than ${lenName} characters`;
        //ctx.redirect('/login/failure');
        return;             
    }
    let firstName = ctx.request.body.firstName;

    //same as first name
    if(ctx.request.body.lastName === null ||ctx.request.body.lastName === undefined){
        ctx.status = 400;
        ctx.body = {'error': "Last name is required."};
        //ctx.redirect('/login/failure');
        return; 
    }
    if(ctx.request.body.lastName.length > lenName){
        ctx.status = 400;
        ctx.body = {'error' : `Last name be less than ${lenName} characters`};
        //ctx.redirect('/login/failure');
        return;
    }
    let lastName = ctx.request.body.lastName;


    //make sure it has an @ sign and possibly ends with a website.
    if(ctx.request.body.email === null||ctx.request.body.email === undefined){
        ctx.status = 400;
        ctx.body = {'error': "Email is required."};
        //ctx.redirect('/login/failure');
        return;
    } 
    if(!ctx.request.body.email.includes('@')){
        ctx.status = 400; 
        ctx.body = {'error': 'Invalid email format.'};
        //ctx.redirect('/login/failure');
        return;
    }
    var email = ctx.request.body.email;


    //make sure certain symbols aren't in here and above a certain amount of characters 
    if(ctx.request.body.password === null||ctx.request.body.password === undefined){
        ctx.status = 400;
        ctx.message = "Nothing was inputed in the 'Password' line";
       // ctx.redirect('/login/failure');
        return; 
    }
    if(ctx.request.body.password > lenName){
        ctx.status = 400;
        ctx.message = `Password must be less than ${lenName} characters.`;  
       // ctx.redirect('/login/failure');
        return;
    }
    let password = ctx.request.body.password;
    
    return User.createUser(email.toLowerCase(), firstName, lastName, password).then((user)=>{
        ctx.status = 200;
        ctx.body = {...user.toJson()};
        return;
        //ctx.redirect('/login/success')
    }).catch(err =>{
        if(process.env.NODE_ENV === "production") {
            ctx.status = 500;
            ctx.body = {'error' : 'A user with that email already exists.'}
            return;
        } 
        else {
            ctx.body = JSON.stringify(err);
            ctx.status = 500;
            return;
        }
    })
   
    //ctx.body = "Success!"; 

    //I want to redirect to the login page here if possible
    //ctx.redirect('/login/success');


});

//needs to be done, as soon as everything is working, this should be ready to go.  



export default router;