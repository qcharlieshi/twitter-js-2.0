'use strict';
var express = require('express');
var router = express.Router();
var tweetBank = require('../tweetBank');
let client = require('../db/index.js')
module.exports = router;

// a reusable function
function respondWithAllTweets (req, res, next){
  let allTheTweets;

  client.query('SELECT * FROM tweets', function (err, result) {
    if (err) return next(err); // pass errors to Express
    //console.log(result.rows);
    allTheTweets = result.rows;

    res.render('index', {
      title: 'Twitter.js',
      tweets: allTheTweets,
      showForm: true
    })
  });
}

// here we basically treet the root view and tweets view as identical
router.get('/', respondWithAllTweets);
router.get('/tweets', respondWithAllTweets);


// single-user page
router.get('/users/:username', function(req, res, next){

  let tweetsForName;

  client.query('SELECT * FROM users INNER JOIN tweets ON tweets.user_id = users.id WHERE name LIKE $1', [req.params.username], function (err, result) {
    if (err) return next(err); // pass errors to Express
    //console.log(result.rows);

  tweetsForName = result.rows;

  res.render('index', {
      title: 'Twitter.js',
      tweets: tweetsForName,
      showForm: true,
      username: req.params.username
    })
  });
});

// single-tweet page
router.get('/tweets/:id', function(req, res, next){
  // var tweetsWithThatId = tweetBank.find({ id: Number(req.params.id) });


  client.query('SELECT * FROM tweets WHERE tweets.id = $1', [req.params.id], function (err, result) {
    if (err) return next(err); // pass errors to Express
    //console.log(result.rows);

    let tweetsWithThatId = result.rows;

    res.render('index', {
      title: 'Twitter.js',
      tweets: tweetsWithThatId
    })
  });

});

// create a new tweet
router.post('/tweets', function(req, res, next){
  let userID;

  client.query('SELECT * from users WHERE users.name LIKE $1', [req.body.name], function(err, result) {
    if (err) return next(err);

    userID = result.rows[0].id;

    client.query('INSERT INTO tweets (user_id, content) VALUES ($1, $2)', [userID, req.body.content], function(err, result) {
          if (err) return next(err);
    })

    res.redirect('/');
  })

  //res.redirect('/');
});



// // replaced this hard-coded route with general static routing in app.js
// router.get('/stylesheets/style.css', function(req, res, next){
//   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
// });
