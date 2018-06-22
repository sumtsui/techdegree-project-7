/* Todo
    - banner
    - error page
    - timestamp
*/
const express = require('express');
const bodyParser = require('body-parser');
const Twit = require('twit');
const config = require('./config');

const app = express();
const router = express.Router();
const T = new Twit(config);

let cache = {};

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static', express.static('public'));
app.use(router);

router.get('/', (req, res) => {
    console.log('Start loading!!!');
    Promise.all([
        T.get('account/verify_credentials', { skip_status: true, include_entities: false }),
        T.get('friends/list', { count: 5 }),
        T.get('statuses/user_timeline', { count: 5 }),
        T.get('direct_messages/events/list', { count: 5 })
    ])
    .then(results => {
        console.log('Done loading account, followings, timeline, and messages');
        return {
            account: results[0].data, 
            users: results[1].data.users,
            tweets: results[2].data,
            messages: results[3].data.events,
            chatBud: {}
        };
    })
    .then(getChatBud)
    .then(result => {
        cache = result;
        console.log('ready to render!!');
        res.render('layout', result);
    })
    .catch(err => {
        console.log('ENCOUNTER ERROR\n', err);
    });
});

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handling middleware
app.use((err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status);
    res.render('error');
});

async function getChatBud(obj) {
    try {
        for (const msg of obj.messages) {
            if (msg.message_create.sender_id !== obj.account.id_str) {
                console.log('Done loading chatBud');
                const profile = await getProfile(msg);
                obj.chatBud = profile.data[0];
                return obj;
            }
        }
    } catch (err) {
        throw err;
    } finally {
        return obj;
    }
}

async function getProfile(msg) {
    return T.get('users/lookup', { user_id: msg.message_create.sender_id });
}

router.post('/', (req, res) => {
    T.post('statuses/update', { status: req.body.tweet })
        .then(result => {
            cache.tweets.unshift(result.data);
            cache.tweets.pop(5);
        })
        .then(() => res.render('layout', cache));
});

app.listen(3000, () => {
    console.log('Application running on localhost:3000');
});