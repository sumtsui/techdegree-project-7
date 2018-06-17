// const twit = require('./config');

const Twit = require('twit');

const T = new Twit({
    consumer_key: 'Skq8tVao6Z9qaT51a4oANRXZ3',
    consumer_secret:      'c0PPSk8AIC5JSALDli8jnSTVwCgl3OMgkDnmXQ4Z0AGOFZj0qY',
    access_token:         '244203632-5s6IUbVwSJjnA81I8UxM1U1s84fz2OWV8ube0pZB',
    access_token_secret:  'uX4U3VDv9xgibbUH6111QQ8m1IEyEajOXHh1BfxfZhrvq',
    timeout_ms: 120*1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL: true,     // optional - requires SSL certificates to be valid.
});

T.get('followers/ids', { screen_name: 'sumtsui' }, function (err, data, response) {
    console.log(data);
});


