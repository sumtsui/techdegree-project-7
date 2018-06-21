const Twit = require('twit');
const config = require('./config');
const T = new Twit(config);
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  Promise.all([
    T.get('account/verify_credentials', { skip_status: true, include_entities: false }),
    T.get('friends/list', { screen_name: 'sumtsui', count: 5 }),
    T.get('statuses/user_timeline', { screen_name: 'sumtsui', count: 5 }),
    T.get('direct_messages/events/list', { count: 5 })
  ])
  .then(results => {
    return {
      account: results[0].data,
      users: results[1].data.users,
      tweets: results[2].data,
      messages: results[3].data.events,
      chatBud: {}
    };
  })
  .then(result => addSenderProfile(result))
  .then(result => res.render('layout', result ))
  .catch(err => console.log('ENCOUNTER ERROR \n', err));
});

async function addSenderProfile(obj) {
  for (const msg of obj.messages) {
    const profile = await getProfile(msg);
    msg.sender = profile.data[0];
    if (msg.sender.name !== obj.account.name) obj.chatBud = msg.sender;
  }
  return obj;
}

async function getProfile(msg) {
  return T.get('users/lookup', { user_id: msg.message_create.sender_id });
}

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