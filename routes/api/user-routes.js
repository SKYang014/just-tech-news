const router = require('express').Router();
const { User } = require('../../models');

// GET /api/users
// GET /api/users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method)
    //the User model inherits functionality from the Sequelize 
    //Model class. .findAll() is one of the Model class's methods. 
    //The .findAll() method lets us query all of the users from 
    //the user table in the database, and is the JavaScript equivalent 
    //of the following SQL query:
    User.findAll({
        //Notice how we now pass an object into the method like we do 
        //with the .findOne() method. This time, we've provided an 
        //attributes key and instructed the query to exclude the 
        //password column. It's in an array because if we want to 
        //exclude more than one, we can just add more.
        attributes: { exclude: ['password'] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET /api/users/1
// GET /api/users/1
router.get('/:id', (req, res) => {
    //This one is a little different from the .findAll() method 
    //in that we're indicating that we only want one piece of 
    //data back. Also, we're actually passing an argument into 
    //the .findOne() method, another great benefit of using Sequelize. 
    //Instead of writing a hefty SQL query, we can use JavaScript 
    //objects to help configure the query!

    //In this case, we're using the where option to indicate we want 
    //to find a user where its id value equals whatever req.params.id is
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        }
    })
        //Because we're looking for one user, there's the possibility 
        //that we could accidentally search for a user with a nonexistent 
        //id value. Therefore, if the .then() method returns nothing from 
        //the query, we send a 404 status back to the client to indicate
        // everything's okay and they just asked for the wrong piece of data.
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/users
// POST /api/users
router.post('/', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    //To insert data, we can use Sequelize's .create() method. 
    //Pass in key/value pairs where the keys are what we defined 
    //in the User model and the values are what we get from req.body. 
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//In this case, a login route could've used the GET method since it 
//doesn't actually create or insert anything into the database. 
//But there is a reason why a POST is the standard for the login that's 
//in process.

//A GET method carries the request parameter appended in the URL string, 
//whereas a POST method carries the request parameter in req.body, 
//which makes it a more secure way of transferring data from the client 
//to the server. Remember, the password is still in plaintext, which 
//makes this transmission process a vulnerable link in the chain.
router.post('/login', (req, res) => {
    // expects {email: 'lernantino@gmail.com', password: 'password1234'}
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' });
            return;
        }

        //res.json({ user: dbUserData });

        // Verify user
        const validPassword = dbUserData.checkPassword(req.body.password);
        //Note that the instance method was called on the user 
        //retrieved from the database, dbUserData. Because the 
        //instance method returns a Boolean, we can use it in a 
        //conditional statement to verify whether the user has been 
        //verified or not.
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }

        res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    //This .update() method combines the parameters for creating data 
    //and looking up data. We pass in req.body to provide the new data 
    //we want to use in the update and req.params.id to indicate where 
    //exactly we want that new data to be used.
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// DELETE /api/users/1
// To delete data, use the .destroy() method and provide some 
//type of identifier to indicate where exactly we would like to 
//delete data from the user database table.
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router; 