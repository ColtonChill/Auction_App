//Author: Jace Longhurst 
const Router =  require('koa-router');
const passport = require('koa-passport');
import User from '../db/User';
const router = new Router();


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
//These are useless will delete. 
router.get('/login/success', async ctx =>{
    ctx.response.body = "Yay!!!";
});

router.post('/login/failure', async ctx =>{
    ctx.response.body = `sorry unauthorized: ${ctx.request.body.Error}`;
});


//This checks whether you are authorized. 
router.get('/login', async ctx =>{
    if(ctx.isAuthenticated()){
        ctx.body = "YUP!" 
        ctx.status = 200;
    }
    else{
        //ctx.status = 401 
        //ctx.redirect('/login/failure')
        ctx.body = "NOPE! "
        ctx.status = 401 
    }
});

//takes username and password through post and logs you in 
//make sure it is username and password and not email and password
router.post('/login', async ctx =>{
    

    //This is where the actual authentication happens 
    return passport.authenticate('local', (err,user)=>{
        if(user){
            ctx.login(user);
            //ctx = 'You made it here!'
            if(ctx.isAuthenticated()){
                console.log('User ' + user.firstName +" " + user.lastName +  ", has logged in successfully.")
                ctx.body = 'User ' + user.firstName + " " + user.lastName +  ", has logged in successfully."
                ctx.status = 200;
            } 
            else{
                ctx.body = 'The authentication is still not working, but you made it here! '
                ctx.status = 400;
            }
        }
        else{
            ctx.status = 401
            ctx.message = err
            //you probably redirect here as well
           // ctx.redirect(`/login/failure?Error=${err}`)  
        }
    })(ctx);
  
});

//This will log you out, duh, nothing to pass here. 
router.get('/logout', async ctx =>{
    if(ctx.isAuthenticated()){
        ctx.logout();
        ctx.body = "User has logged out successfully."
        ctx.status = 200; 
    }
    else{
        ctx.status = 401
        ctx.body = "Error: You aren't logged in"
    }
});


router.post('/register', async ctx =>{
//requires fname, lname, email, password

    var lenName = 30; 

    //optional make it so that this is only letters
    //inside this makes sure the name is under a certain length
    if(ctx.request.body.fname === null|| ctx.request.body.fname === undefined){
        ctx.status = 400;
        ctx.message = "Nothing was inputed in the 'First Name' line" + ctx.request.body;
        //ctx.redirect('/login/failure');
        return; 
    }
    else if (!(ctx.request.body.fname.length > lenName)){
        var fname = ctx.request.body.fname;
    }
    else{
        ctx.status = 400;
        ctx.message = "No special symbols and must be under 30 characters";
        //ctx.redirect('/login/failure');
        return;             
    }

    //same as first name
    if(ctx.request.body.lname === null ||ctx.request.body.lname === undefined){
        ctx.status = 400;
        ctx.message = "Nothing was inputed in the 'Last Name' line";
        //ctx.redirect('/login/failure');
        return; 
    }

    else if(!(ctx.request.body.lname.length > lenName)){
        var lname = ctx.request.body.lname;
    }
    else{
        ctx.status = 400;
        ctx.message = "error : Last name should have no special symbols and be under 30 characters";
        //ctx.redirect('/login/failure');
        return;
    }


    //make sure it has an @ sign and possibly ends with a website.
    if(ctx.request.body.email === null||ctx.request.body.email === undefined){
        ctx.status = 400;
        ctx.message = "Nothing was inputed in the 'Email' line";
        //ctx.redirect('/login/failure');
        return;
    } 
    else if(ctx.request.body.email.includes('@')){
        var email = ctx.request.body.email;
    }
    else{
        ctx.status = 400; 
        ctx.message = "email needs to have an @";
        //ctx.redirect('/login/failure');
        return;
    }


    //make sure certain symbols aren't in here and above a certain amount of characters 
    if(ctx.request.body.password === null||ctx.request.body.password === undefined){
        ctx.status = 400;
        ctx.message = "Nothing was inputed in the 'Password' line";
       // ctx.redirect('/login/failure');
        return; 
    }
    if(!(ctx.request.body.password > lenName)){
        var password = ctx.request.body.password;
    }
    else{
        ctx.status = 400;
        ctx.message = " Must not include (forbidden symbols)";  
       // ctx.redirect('/login/failure');
        return;
    }
    
    User.createUser(email, fname, lname, password).then(()=>{
        ctx.status = 200;
        ctx.body = 'Success!'
        //ctx.redirect('/login/success')
    }).catch(err =>{
        ctx.message = JSON.stringify(err);
        ctx.status = 400;

    })
   
    //ctx.body = "Success!"; 

    //I want to redirect to the login page here if possible
    //ctx.redirect('/login/success');


});

//needs to be done, as soon as everything is working, this should be ready to go.  



export default router;