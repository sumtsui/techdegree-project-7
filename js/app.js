const twit = require('./config');

twit.get('followers/ids', { screen_name: 'sumtsui' }, function (err, data, response) {
    if (err) console.log('fucking error!!', err);
    else console.log('didn\'t do commit. my followers: ', data);
});


