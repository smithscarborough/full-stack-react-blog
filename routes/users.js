var express = require('express');
var router = express.Router();
// import the models folder so that we can check if a user already exists:
const models = require('../models');
// install bcrypt (npm i bcrypt) and include up here so that we can use it to encrypt user password
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// POST /api/v1/users/register
router.post('/register', async (req, res) => {
  // Check that the username and password exists on the request 
  if (!req.body.username || !req.body.password) {
    // including a return below, so that if this happens, it will stop running this function and prevent it from continuing down the page and running the rest of this code
    return res.status(400).json({
      error: 'Please include username and password.',
    });
  }

  // check database for existing user
  const user = await models.User.findOne({
    where: {
      // check where the username is the same as the username that came in on the body of the request
      username: req.body.username,
    },
  });
  
  // if exists, send error
  if (user) {
    return res.status(400).json({
      error: 'Username already in use.',
    });
  }

  // hash password using bcrypt (npm i bcrypt, and require it at the top)
  // note: the 10 below is the number of times it will do the calculation -- 10 is a good number b/c it's long enough where someone won't be able to use brute force to hack it, but not so long that it takes forever to render
  const hash = await bcrypt.hash(req.body.password, 10);

  // create user
  const newUser = await models.User.create({
    // pass the username and password to the DB
    username: req.body.username,
    password: hash,
  });

    // respond with success message
    return res.status(201).json(newUser);
    });

  router.post('/login', async (req, res) => {
    // check if everything we need is located on the req body
        // if not there, send error
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({
        error: 'Please include username and password.',
      });
    }
    // find user from username
    const user = await models.User.findOne({
      where: {
        username: req.body.username,
      },
    });
      // if no user, send error
    if (!user) {
      return res.status(404).json({
        error: 'No user with that username found.',
      });
    }
      // if they do exist, then we need to check the password
      const match = await bcrypt.compare(req.body.password, user.password);
        // if password doesn't match, send an error
      if (!match) {
        return res.status(401).json({
          error: 'Password incorrect',
        });
      }
      // when the user logs in, store the user in session
      req.session.user = user;
        // if password does match, store user in session and then respond with user info
    
        // respond with user info (specifically excludes their password, to avoid transferring sensitive info; alternatively you could write it to exclude the password, as opposed to specifying what to include as we do here):
      res.json({
        id: user.id,
        username: user.username,
        updatedAt: user.updatedAt
        });
      });


      router.get('/logout', (req, res) => {
        // clear user data from session by setting their session equal to null
        req.session.user = null;
        // respond to the user once logout is complete (i.e. send success response)
        res.json({
          success: 'Logged out successfully.',
        });
      });

      // because this is in the users router, "current" will always be the current user
      router.get('/current', (req, res) => {
        const { user } = req.session;
        if (user) {
          res.json({
            id: user.id,
            username: user.username,
            updatedAt: user.updatedAt,
          });
        } else {
          res.status(401).json({
            error: 'Not logged in.',
          });
        }
      });

module.exports = router;
