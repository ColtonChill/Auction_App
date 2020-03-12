//Author: Jace Longhurst 
const Router =  require('koa-router');
//import passport from '../services/LocalAuthentication';
const passport = require('koa-passport');
import User from '../db/User';
const bodyParser = require('koa-bodyparser');
const router = new Router();
router.use(bodyParser());

//api/v1/auth

//Proof that you made it
//Not really nessecary  
router.get('/', async ctx =>{
    ctx.response.body = "Welcome to the authorization api!";
    ctx.status = 200; 
});

/*
testing screens for the api until I know what to do with them. 
*/
router.get('/login/success', async ctx =>{
    ctx.response.body = "Yay!!!";
});

router.post('/login/failure', async ctx =>{
    ctx.response.body = `sorry unauthorized: ${ctx.request.body.Error}`;
});


//This checks whether you are authorized. 
router.get('/login', async ctx =>{
    if(ctx.isAuthenticated()){
        //redirect to Sally's home page 
        ctx.redirect('/login/success')
    }
    else{
        //ctx.status = 401 
        ctx.redirect('/login/failure')
    }
});

//takes username and password through post and logs you in 
router.post('/login', async ctx =>{
    //await ctx.login()
    //ctx.authenticate()

    //This is where the actual authentication happens 
    return passport.authenticate('local', (err,user)=>{
        if(user){
            console.log('User ' + user.firstname + user.lastname +  ", has logged in successfully.")
            ctx.login(user)
            //This is where you probably redirect, 
            ctx.redirect('/login/success')

        }
        else{
            ctx.status = 401
            //you probably redirect here as well
            ctx.redirect(`/login/failure?Error=${err}`)  
        }
    })(ctx);
    /*
    ctx.request.body.username;
    ctx.request.body.password;
    */
});

router.post ('/register', async ctx =>{
    //inside this make sure the name is nothing but letters and is only a certain length
    if(ctx.request.body.fname === null|| ctx.request.body.fname === undefined){
        ctx.status = 400;
        ctx.message = "Nothing was inputed in the 'First Name' line";
        ctx.redirect('/login/failure');
        return; 
    }
    else if (!(ctx.request.body.fname.length > 30)){
        var fname = ctx.request.body.fname;
    }
    else{
        ctx.status = 400;
        ctx.message = "No special symbols and must be under 30 characters";
        ctx.redirect('/login/failure');
        return;             
    }

    //same as first name
    if(ctx.request.body.lname === null ||ctx.request.body.lname === undefined){
        ctx.status = 400;
        ctx.message = "Nothing was inputed in the 'Last Name' line";
        ctx.redirect('/login/failure');
        return; 
    }

    else if(!(ctx.request.body.lname.length > 30)){
        var lname = ctx.request.body.lname;
    }
    else{
        ctx.status = 400;
        ctx.message = "error : Last name should have no special symbols and be under 30 characters";
        ctx.redirect('/login/failure');
        return;
    }


    //make sure it has an @ sign and possibly ends with a website.
    if(ctx.request.body.email === null||ctx.request.body.email === undefined){
        ctx.status = 400;
        ctx.message = "Nothing was inputed in the 'Email' line";
        ctx.redirect('/login/failure');
        return;
    } 
    else if(ctx.request.body.email.includes('@')){
        var email = ctx.request.body.email;
    }
    else{
        ctx.status = 400; 
        ctx.message = "email needs to have an @";
        ctx.redirect('/login/failure');
        return;
    }


    //make sure certain symbols aren't in here and above a certain amount of characters 
    if(ctx.request.body.password === null||ctx.request.body.password === undefined){
        ctx.status = 400;
        ctx.message = "Nothing was inputed in the 'Password' line";
        ctx.redirect('/login/failure');
        return; 
    }
    if(!(ctx.request.body.password > 30)){
        var password = ctx.request.body.password;
    }
    else{
        ctx.status = 400;
        ctx.message = " Must not include (forbidden symbols)";  
        ctx.redirect('/login/failure');
        return;
    }
    
    User.createUser(email, fname, lname, password);
    
    //I want to redirect to the login page here if possible
    ctx.redirect('/login/success');


});

//needs to be done, link to authorization, 
//Fix the error that is not letting body parser do its thing, also passport
//add a logout, 
//make a test
//check the other functionality that we need 


export default router;