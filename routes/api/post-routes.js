const router = require('express').Router();
const { Post, User, Vote } = require('../../models');
const sequelize = require('../../config/connection');

// get all users
router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            //Sequelize provides us with a special method called 
            //.literal() that allows us to run regular SQL queries 
            //from within the Sequelize method-based queries. So when 
            //we vote on a post, we'll see that post—and its updated 
            //vote total—in the response.
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
        //shows most recent posts first
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/', (req, res) => {
    // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//When we vote on a post, we're technically updating that post's data. 
//This means that we should create a PUT route for updating a post.
// PUT /api/posts/upvote
// router.put('/upvote', (req, res) => {
//     Vote.create({
//         user_id: req.body.user_id,
//         post_id: req.body.post_id
//     })
//         //when we vote on a post, we receive the post's updated information
//         //also include a total count of votes for the post.
//         .then(() => {
//             // then find the post we just voted on
//             return Post.findOne({
//                 where: {
//                     id: req.body.post_id
//                 },
//                 attributes: [
//                     'id',
//                     'post_url',
//                     'title',
//                     'created_at',
//                     // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
//                     [
//                         sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
//                         'vote_count'
//                     ]
//                 ]
//             })
//                 .then(dbPostData => res.json(dbPostData))
//                 .catch(err => res.json(err));
//         });
// }

//refactored^
router.put('/upvote', (req, res) => {
    // custom static method created in models/Post.js
    Post.upvote(req.body, { Vote })
        .then(updatedPostData => res.json(updatedPostData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

//Notice that we used the request parameter to find the post, 
//then used the req.body.title value to replace the title of the post. 
//In the response, we sent back data that has been modified and stored 
//in the database.
router.put('/:id', (req, res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//For this operation, we will use Sequelize's destroy method and 
//using the unique id in the query parameter to find then delete 
//this instance of the post
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;