const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Vote extends Model { }

//Now, with these columns in place, we can track the posts that users 
//vote on. When a user votes on a post, we'll insert a new row of data
// to the table, which lists the primary key of the user and the primary
// key of the post they voted on.
Vote.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        //  we added a user_id field that would hold the primary key 
        //value of a user and post
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'post',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'vote'
    }
);

module.exports = Vote;