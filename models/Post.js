//we'll import the elements that we'll need to build the Post model. 
//This will include the connection to MySQL we stored in the 
//connection.js file as well as Model and Datatypes we'll use from the 
//sequelize package.
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Post model
class Post extends Model { }

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