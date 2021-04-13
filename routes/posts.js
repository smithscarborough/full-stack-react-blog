var express = require('express');
const checkAuth = require('../auth/checkAuth');
var router = express.Router();
const models = require('../models');

// this is the back-end route that accepts each new blog post into the BE

// GET posts
router.get('/', async (req, res) => {
    // get all posts
    const posts = await models.Post.findAll({
        include: [
            { 
                model: models.User, 
                attributes: ['username', 'id'],
            },
        ],
    });

    res.json(posts);
});

// checkAuth in the params below passes the req/res to the checkAuth middleware to confirm that a user has logged in
router.post('/', checkAuth, async (req, res) => {
    const { user } = req.session;
    // if user not logged in, send 401 error
    if (!user) {
        return res.status(401).json({
            error: 'Not logged in.'
        });
    }

    // check for all fields
    // if there are any missing fields
    if (!req.body.title || !req.body.content) {
        // send 400 error
        return req.status(400).json({
            error: 'Please include title and content.',
        });
    }

    // create new post
    const post = await models.Post.create({
        title: req.body.title,
        content: req.body.content,
        UserId: req.session.user.id,
    });
        // send back new post data
        // status code 201 = successfully created
    res.status(201).json(post);
});

// the below route is already in the router, so it already has the full url path in the name, so we just had the specific part that's on the end
// add checkAuth below to only allow users to comment if they are logged in.  This is middleware (FYI)
router.post('/:id/comments', checkAuth, async (req, res) => {
    const post = await models.Post.findByPk(req.params.id)
    if (!post) {
        res.status.apply(404).json({
            error: 'Could not find post with that ID.'
        });
    }

    if (!req.body.text) {
        res.status(400).json({
            error: 'Please include all required fields.',
        });
    }

    // this one pulls data from all over the place
    const comment = await post.createComment({
        text: req.body.text,
        PostId: req.params.id,
        UserId: req.session.user.id,
    });

    // if the above code works, then do this:
    res.status(201).json(comment);
});

router.get('/:id/comments', async (req, res) => {
    const post = await models.Post.findByPk(req.params.id);
    if (!post) {
        res.status(404).json({
            error: 'Could not find post with that ID.',
        });
    }

    const comments = await post.getComments({
        include: [{ model: models.User, attributes: ['username', 'id'] }],
    });

    res.json(comments);
});


module.exports = router;