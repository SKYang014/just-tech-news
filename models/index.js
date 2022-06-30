//All this file is responsible for right now is importing the 
//User model and exporting an object with it as a property. 
//It seems unnecessary at the moment, but doing this now will 
//set us up for future growth of the application.

const User = require('./User');
const Post = require('./Post');

// create associations
//a post only belongs to a single user, and never many users. 
//By this relationship definition, we know we have a one-to-many 
//relationship. Thanks to Sequelize, we can now use JavaScript to 
//explicitly create this relation. This association creates the 
//reference for the id column in the User model to link to the corresponding foreign key pair, which is the user_id in the Post model.

//We also need to make the reverse association

User.hasMany(Post, {
    foreignKey: 'user_id'
});

Post.belongsTo(User, {
    foreignKey: 'user_id',
});

module.exports = { User, Post };