//Before setting up columns for the table, let's review 
//what we just wrote. First, we imported the Model class and 
//DataTypes object from Sequelize. This Model class is 
//what we create our own models from using the extends keyword so 
//User inherits all of the functionality the Model class has.

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create our User model
class User extends Model {

    //In Object Oriented Programming, an instance method returns or 
    //makes use of information (i.e., properties) specific to that 
    //particular object. (Remember that objects generated from classes 
    //are instances of the class.)

    //So, we should create an instance method on the User model 
    //definition to access the password property of each user instance

    //add an instance method called checkPassword that takes in 
    //the plaintext password retrieved from the client request at 
    //req.body.email and compares that with the hashed password. 
    //This method will include the compareSync function from bcrypt
    // set up method to run on instance data (per user) to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}


//Once we create the User class, we use the .init() method to 
//initialize the model's data and configuration, passing in two 
//objects as arguments. The first object will define the columns 
//and data types for those columns. The second object it accepts 
//configures certain options for the table.

User.init(
    {
        // define an id column
        id: {
            // use the special Sequelize DataTypes object provide what type of data it is
            type: DataTypes.INTEGER,
            // this is the equivalent of SQL's `NOT NULL` option
            allowNull: false,
            // instruct that this is the Primary Key
            primaryKey: true,
            // turn on auto increment
            autoIncrement: true
        },
        // define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be any duplicate email values in this table
            unique: true,
            // if allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // this means the password must be at least four characters long
                len: [4]
            }
        }
    },
    {
        hooks: {
            // set up beforeCreate lifecycle "hook" functionality
            //Let's break down this code to see what is happening. 
            //We use the beforeCreate() hook to execute the bcrypt hash 
            //function on the plaintext password. In the bcrypt hash 
            ///function, we pass in the userData object that contains 
            //the plaintext password in the password property. We also 
            //pass in a saltRound value of 10.

            //The resulting hashed password is then passed to the Promise 
            //object as a newUserData object with a hashed password 
            //property. The return statement then exits out of the 
            //function, returning the hashed password in the newUserData 
            //function.

            //  beforeCreate(userData) {
            // return bcrypt.hash(userData.password, 10).then(newUserData => {
            //     return newUserData
            //   });
            // }

            //refactored vv
            //The keyword pair, async/await, works in tandem to make 
            //this async function look more like a regular synchronous 
            //function expression.

            //The async keyword is used as a prefix to the function 
            //that contains the asynchronous function. await can be 
            //used to prefix the async function, which will then 
            //gracefully assign the value from the response to the 
            //newUserData's password property. The newUserData is then 
            //returned to the application with the hashed password.
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            // set up beforeUpdate lifecycle "hook" functionality
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },

        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user'
    }
);
//This method will autogenerate a salt. Notice the saltRounds parameter. 
//This is known as the cost factor and controls how many rounds of 
//hashing are done by the bcrypt algorithm. The more hashing rounds, 
//the longer it takes to hash, the more time it would take to crack 
//using a brute-force attack.

module.exports = User;