const passport =require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passportField: 'password',
    passReqToCallback: true
} , async(req, username, password, done) => {
    //console.log(req.body);
    const UsersName =await pool.query('select* from users where username = ?',[username]);

    if(UsersName.length > 0){
        const user = UsersName[0];
        if (user.username == username){
         const ValidPassword = await helpers.comperdPassword(password, user.password );

          if(ValidPassword){
            done(null,user,req.flash('success','Bienvenido ' + user.username));

          }else{
            done(null,false, req.flash('message','Constraseña incorrecta'));
          }

        }else{
        done(null,false,req.flash('message','Usuario no registrado'));
        }   

    } else{
        done(null,false, req.flash('message','Usuario no registrado'));
    }

}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passportField: 'password',
    passReqToCallback: true

} , async(req, username, password, done) =>{
    //console.log(req.body);
    const {fullname} = req.body;
    const newUser = {
        username,
        password,
        fullname
    };

    newUser.password =  await helpers.encryptPassword(password);
    
    try {
        const resp = await pool.query('select username from users where username =?',[username]);      
      
        if (resp.length > 0 ){
            const usr = resp[0];  

          if (newUser.username == usr.username ){
            done(null,false, req.flash('message','Usuario ya registrado'));

          } else{
            const result = await pool.query('insert into users set ?',[newUser]);
            //console.log(result);
            newUser.id = result.insertId;
            return  done(null, newUser);
          }

        } else{
            const result = await pool.query('insert into users set ?',[newUser]);
            //console.log(result);
            newUser.id = result.insertId;
            return  done(null, newUser);
        }
    
    } catch (e) {
        console.log(e);
    }
    
}));

passport.serializeUser((user,done) => {
    done(null,user.id)
});

passport.deserializeUser( async (id, done) =>{
  const result = await pool.query('select * from users where id = ?', [id]);
  done(null,result[0]);
 
});