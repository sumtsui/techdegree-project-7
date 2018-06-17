const twit = require('./config');

twit.get('statuses/user_timeline', { screen_name: 'sumtsui' }, function (err, data, response) {
    if (err) console.log('fucking error!!', err);
    else console.log('my followers: ', data);
});

