const twit = require('./config');
const express = require('express');

const app = express();

app.use((req, res, next) => {
    let users = [];
    twit.get('friends/list', { screen_name: 'sumtsui', count: 5 }, function (err, data, res) {
        if (err) console.log('fucking error!!', err);
        else {
            users = data.users;
        }
    });
    
    let tweets = [];
    twit.get('statuses/user_timeline', { screen_name: 'sumtsui' }, function (err, data, response) {
        if (err) console.log('fucking error!!', err);
        else {
            tweets = data;
        }
    });

    res.locals.users = users;
    res.locals.tweets = tweets;

    next();

});

// let msgEvents = twit.get('direct_messages/events/list')
//     .then((result) => {
//         const arr = []
//         result.data.events.forEach(event => {
//             arr.push(event);
//         });
//         return arr;
//     });

// // let promises;    
// const msgs = [];
// app.use((req, res, next) => {
//     console.log('##########################', msgEvents);
//     msgEvents.then(result => result.forEach(msg => {
//         twit.get('users/lookup', { user_id: msg.message_create.sender_id }, (data, err) => {
//             msg.sender = data;
//             msgs.push(msg);
//         });
//     }));
//     next();
// });

// app.use((req, res, next) => {
//     console.log('##########################fuck', msgs);
//     next();
// });

let msgEvents = [];
twit.get('direct_messages/events/list')
    .then((result) => {
        result.data.events.forEach(event => {
            msgEvents.push(event);
        });
        return msgEvents;
    })
    .then((result) => {
        result.forEach(msg => {
            twit.get('users/lookup', { user_id: msg.message_create.sender_id }, function (err, data, res) {
                msg.sender = data;
            });
        }); 
    })
    .catch((err) => { console.log('fuck!! Error!!', err.stack); });

let account;
twit.get('account/verify_credentials', { skip_status: true, include_entities: false }, function (err, data, res) {
    if (err) console.log('fucking error!!', err);
    else {
        account = data;
    }
});

app.set('view engine', 'pug');
app.use('/static', express.static('public'));

app.get('/', (req, res) => {
    // console.log('##########################', msgEvents[3].sender);
    res.render('app', { msgEvents, account });
});

app.listen(3000, () => {
    console.log('Application running on localhost:3000');
});

