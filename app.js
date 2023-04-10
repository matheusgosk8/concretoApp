const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const MONGO_URI = require('dotenv').config();
const uri = process.env.MONGO_URI;



const app = express();

// Mongoo db connection
const db = mongoose.connection;
mongoose.connect(uri);

db.once('open', ()=> console.log("Conexão com a base de dados bem sucedida"));
db.on('error', (err)=>console.log(err));


// Rotas
const home = require('./routes/homePage');
const sobre = require('./routes/sobrePage');
const data = require('./routes/dataPage');



app.engine("handlebars", exphbs.engine({ defaultLayout: "layout", runtimeOptions: {
	allowProtoPropertiesByDefault: true,
	allowProtoMethodsByDefault: true} }));
app.set('view engine', 'handlebars');

// Handlebars
app.set('views', path.join(__dirname,'views'));


// Handlebars custom halpers
const Handlebars = require('handlebars');
Handlebars.registerHelper('equal', function(A, B, options){
    if(A != B){
        return options.inverse(this);
    } if( arguments.legth < 3) {throw new Error('Handlebars compare needs 2 values!')} 
    else
    {
        return options.fn(this);
    }
});

Handlebars.registerHelper('nequal', function(A, B, options){
    if(A == B){
        return options.inverse(this);
    } if( arguments.legth < 3) {throw new Error('Handlebars compare needs 2 values!')} 
    else
    {
        return options.fn(this);
    }
});

Handlebars.registerHelper('closer', function(A,B,options){
    if((A-B) <= 1 && (A-B) >= 0){
        return options.fn(this);
    }
    else{

        return options.inverse(this);
    }
});
Handlebars.registerHelper('close', function(A,B,options){
    if((A-B) > 1 && (A-B) <= 2 ){
        return options.fn(this);
    }
    else{

        return options.inverse(this);
    }
});
Handlebars.registerHelper('far', function(A, B,options){

    if((A-B) > 2 && (A-B) <= 5){
        return options.fn(this);
    }
    else{

        return options.inverse(this);
    }
});
Handlebars.registerHelper('further', function(A,B,options){
    if((A-B) > 5){
        return options.fn(this);
    }
    else{

        return options.inverse(this);
    }
});

Handlebars.registerHelper('invalid', function(A,B,options){
    if((A-B) < 0){
        return options.fn(this);
    }
    else{

        return options.inverse(this);
    }
});

Handlebars.registerHelper('positivo', function(A,options){
    if(A > 0){
        return options.fn(this);
    }
    else{

        return options.inverse(this);
    }
});
Handlebars.registerHelper('negativo', function(A,options){
    if(A < 0){
        return options.fn(this);
    }
    else{

        return options.inverse(this);
    }
});
// Handlebars custom halpers

app.use(express.json());
app.use(express.urlencoded({extended: true}));
// body parser

app.use(express.static(path.join(__dirname, 'public')));
// Pasta pública
app.use('/', home);
app.use('/sobre', sobre);
app.use('/data', data);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Servidor aberto no port: ${PORT}`));