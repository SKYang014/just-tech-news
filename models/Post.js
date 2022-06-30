//we'll import the elements that we'll need to build the Post model. 
//This will include the connection to MySQL we stored in the 
//connection.js file as well as Model and Datatypes we'll use from the 
//sequelize package.
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Post model
class Post extends Model {
    //Here, we're using JavaScript's built-in static keyword to indicate 
    //that the upvote method is one that's based on the Post model and 
    //not an instance method like we used earlier with the User model. 
    //This exemplifies Sequelize's heavy usage of object-oriented
    // principles and concepts.
    static upvote(body, models) {
        //See how it's almost the exact same code we implemented into 
        //the PUT route earlier? The only real difference here is that 
        //we're using models.Vote instead, and we'll pass the Vote model 
        //in as an argument from post-routes.js.
        return models.Vote.create({
            user_id: body.user_id,
            post_id: body.post_id
        }).then(() => {
            return Post.findOne({
                where: {
                    id: body.post_id
                },
                attributes: [
                    'id',
                    'post_url',
                    'title',
                    'created_at',
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
                        'vote_count'
                    ]
                ]
            });
        });
    }
}

// create fields/columns for Post model
Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isURL: true
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            //this column determines who posted the news article. 
            //Using the references property, we establish the 
            //relationship between this post and the user by creating a 
            //reference to the User model, specifically to the id column 
            //that is defined by the key property, which is the primary 
            //key. The user_id is conversely defined as the foreign key 
            //and will be the matching link.
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post;