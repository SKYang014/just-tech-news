//All this file is responsible for right now is importing the 
//User model and exporting an object with it as a property. 
//It seems unnecessary at the moment, but doing this now will 
//set us up for future growth of the application.

const User = require('./User');
const Post = require('./Post');

module.exports = { User, Post };