//importacion de 
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require ('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');

const {database} = require('./keys')
//inicializacion de exprees
const app = express();
require('./lib/passport');

//configuracion del servidor express
//encender el servidor npm run dev
app.set('port', process.env.PORT || 4000);
app.set('views',path.join(__dirname, 'views'));
app.engine('.hbs',exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'),'partials'),
  extname:'.hbs',
  helpers: require('./lib/handlebars')
}));

app.set('view engine', '.hbs');

//Middlewares
app.use(session({
  secret: 'BrayanMsqlNodeSession',
  resave: 'false',
  saveUninitialized: 'false',
  store: new MySQLStore(database)

}));
app.use(flash());
app.use( morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


//Variables globales
app.use((req,res,next) => {
  app.locals.success = req.flash('success');
  app.locals.message = req.flash('message');
  app.locals.user    = req.user;
  next();
});


//rutas 
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));

//public
app.use(express.static(path.join(__dirname,'public')));  


//inicializar el servidor
app.listen(app.get('port'), () =>{
  console.log('Servidor corriendo en puerto',app.get('port'));
});