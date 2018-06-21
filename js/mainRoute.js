const Twit = require('twit');
const config = require('./config');
const T = new Twit(config);
const express = require('express');
const router = express.Router();

let users;
let tweets;
let account;
let messages = [];
let chatWith;

T.get('account/verify_credentials', { skip_status: true, include_entities: false }, (err, data) => {
  if (err) console.log('ERROR!!!!!!!!', err.stack);
  else account = data;
});

T.get('friends/list', { screen_name: 'sumtsui', count: 5 }, function (err, data) {
  if (err) console.log('fucking error!!', err);
  else users = data.users;
});

T.get('statuses/user_timeline', { screen_name: 'sumtsui' }, function (err, data) {
  if (err) console.log('fucking error!!', err);
  else tweets = data;
});

// get 5 recent messages 
T.get('direct_messages/events/list', { count: 5 })
  .then((result) => {
    result.data.events.forEach(msg => {
      messages.push(msg);
      T.get('users/lookup', { user_id: msg.message_create.sender_id })
        .then((result) => {
          msg.sender = result.data[0];
          if (msg.sender.name !== account.name) chatWith = msg.sender;
        })
        .catch((err) => console.log('ERROR!!!!', err));
    });
  })
  .catch((err) => console.log('ERROR!!!!', err));

router.get('/', (req, res) => {
  res.render('index', { users, tweets, messages, account, chatWith });
});

router.post('/', (req, res) => {
  T.post('statuses/update', { status: req.body.tweet }, function(err, data) {
    T.get('statuses/user_timeline', { screen_name: 'sumtsui' }, function (err, data) {
      if (err) console.log('fucking error!!', err);
      else {
        tweets = data;
        res.redirect('/');
      }
    });
  });
});

module.exports = router;