//. This may seem like a lot of files that do very little, 
//but the ultimate idea is that if we were to scale this application, 
//staying organized from the outset is a lot easier than reorganizing 
//later on when there's more code to move around.
const router = require('express').Router();

const apiRoutes = require('./api');

router.use('/api', apiRoutes);

//Also, note that second use of router.use(). This is so if we make 
//a request to any endpoint that doesn't exist, we'll receive 
//a 404 error indicating we have requested an incorrect resource, 
//another RESTful API practice.
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;