const twit = require('./config');

twit.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
    console.log(data)
  })