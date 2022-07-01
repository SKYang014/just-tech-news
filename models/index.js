//All this file is responsible for right now is importing the 
//User model and exporting an object with it as a property. 
//It seems unnecessary at the moment, but doing this now will 
//set us up for future growth of the application.

const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');
const Comment = require('./Comment');

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

//Now we need to associate User and Post to one another in a way that 
//when we query Post, we can see a total of how many votes a user creates;
// and when we query a User, we can see all of the posts they've voted on.
// You might think that we can use .hasMany() on both models, but instead 
//we need to use .belongsToMany().

//With these two .belongsToMany() methods in place, we're allowing both 
//the User and Post models to query each other's information in the 
//context of a vote. If we want to see which users voted on a single post,
// we can now do that. If we want to see which posts a single user voted 
//on, we can see that too. This makes the data more robust and gives us 
//more capabilities for visualizing this data on the client-side.
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});

Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

//By also creating one-to-many associations directly between these 
//models, we can perform aggregated SQL functions between models. 
//In this case, we'll see a total count of votes for a single post 
//when queried. This would be difficult if we hadn't directly associated 
//the Vote model with the other two.
Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Vote, {
    foreignKey: 'user_id'
});

Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

//Note that we don't have to specify Comment as a through table 
//like we did for Vote. This is because we don't need to access 
//Post through Comment; we just want to see the user's comment 
//and which post it was for. Thus, the query will be slightly different.
Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Comment, {
    foreignKey: 'user_id'
});

Post.hasMany(Comment, {
    foreignKey: 'post_id'
});
module.exports = { User, Post, Vote, Comment };