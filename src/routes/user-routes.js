import express from 'express';
import passport from '../lib/login.js';
import {createUser,findByUsername} from '../lib/users.js';

export const userRouter = express.Router();

function login(req,res){
    if (req.isAuthenticated()){
        return res.redirect('/login');
    }
    let message = '';

    if (req.session.messages && req.session.messages.length > 0){
        message = req.session.messages.join(', ');
        req.session.messages = [];
    }
    return res.render('login', {message,title: 'Aðgangur'});
}
userRouter.get('/login',login);
userRouter.post('/login',
    passport.authenticate('local',{
        failureMessage: 'Notandanafn eða lykilorð vitlaust.',
        failureRedirect: '/login'
    }),
    (req,res) => {
        res.redirect('/login');
    }
);
userRouter.get('/register', (req,res) =>{
    res.render('register', {title: 'Nýr Notandi'})
    }
)
userRouter.post('/register',async (req,res) => {
    const {username,password} = req.body;
    if(!username || !password){
        return res.render('register');
    }
    const exists = await findByUsername(username);
    if(exists){
        return res.render('register');
    }
    const user = await createUser(username,password);
    if (!user){
        return res.render('register');
    }
    return res.redirect('/login');
})

userRouter.get('/logout', (req,res) =>{
    req.logout();
    res.redirect('/');
});