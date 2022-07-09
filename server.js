const path = require('path');
const express = require('express');
//const routes = require('./controllers/');

//Since we set up the routes the way we did, we don't have to 
//worry about importing multiple files for different endpoints. 
//The router instance in routes/index.js collected everything for us 
//and packaged them up for server.js to use.
const exphbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require('./config/connection');

const hbs = exphbs.create({});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//imports and uses handlebars 4x
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// turn on routes
//app.use(routes);
//connects to style sheet, midddleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./controllers/'));
// turn on connection to db and server
//Also, note we're importing the connection to Sequelize from 
//config/connection.js. Then, at the bottom of the file, we use the 
//sequelize.sync() method to establish the connection to the database. 
//The "sync" part means that this is Sequelize taking the models and 
//connecting them to associated database tables. If it doesn't find a 
//table, it'll create it for you!
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});

//The other thing to notice is the use of {force: false} in
//the .sync() method. This doesn't have to be included, but if it were
//set to true, it would drop and re-create all of the database tables
//on startup. This is great for when we make changes to
//the Sequelize models, as the database would need a way to understand
//that something has changed. We'll have to do that a few times
//throughout this project, so it's best to keep the {force: false}
//there for now.

//In the sync method, there is a configuration parameter 
//{ force: false }. If we change the value of the force property 
//to true, then the database connection must sync with the model 
//definitions and associations. By forcing the sync method to true, 
//we will make the tables re-create if there are any association changes.

//Then we should change this value back to false. Dropping all the 
//tables every time the application restarts is no longer necessary 
//and in fact will constantly drop all the entries and seed data we enter,
// which can get very annoying.