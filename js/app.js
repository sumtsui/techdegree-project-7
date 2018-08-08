const express = require('express');
const bodyParser = require('body-parser');
const Twit = require('twit');
const config = require('./config');
const timeFormatter = require('./timeFormatter');

const port = process.env.PORT || 3000;
const app = express();
const router = express.Router();
const T = new Twit(config);

// to hold all content loaded from 'get' and pass to 'post', so that no need to reload everything after posting a new tweet. nasty nasty global variable. want to get rid of it someday:
let cache = {};

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static', express.static('public'));
app.use(router);

router.get('/', (req, res, next) => {
	Promise
		.all([
			T.get('account/verify_credentials', { skip_status: true, include_entities: false }),
			T.get('friends/list', { count: 5 }),
			T.get('statuses/user_timeline', { count: 5 }),
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
		// .then(r => {
		// 	console.log('\n*********** DATA ***********\n\n', r);
		// 	return r;
		// })
		.then(getChatBud)
		.then(setTimeFormat)
		.then(result => {
			cache = result;
			res.render('index', result);
		})
		.catch(e => {
			console.log('\n\nAfter Tweet Get:\n\n', e);
			next(e);
		})
});

router.post('/', (req, res, next) => {
	T.post('statuses/update', { status: req.body.tweet })
		.then(result => {
			result.data.created_at = timeFormatter(result.data.created_at);
			cache.tweets.unshift(result.data);
			cache.tweets.pop(5);
		})
		.then(() => res.render('index', cache))
		.catch(e => {
			console.log('\n\nAfter Tweet Post:\n\n', e);
			next(e);
		})
});

// catch 404
app.use((req, res, next) => {
	const err = new Error('Page Not Found');
	err.status = 404;
	next(err);
});

// handle error 
app.use((err, req, res, next) => {
	console.log("\n\n*** Error ***\n", err.stack);
	err.status = (err.status || 500);
	if (err.message !== 'Page Not Found') err.message = "Server Error";
	res.render('error', { err });
});

// loop thru msgs and break when find a msg with sender id different from auth account id. 
async function getChatBud(obj) {
	try {
		for (let msg of obj.messages) {
			if (msg.message_create.sender_id !== obj.account.id_str) {
				const profile = await getProfile(msg);
				obj.chatBud = profile.data[0];
				return obj;
			}
		}
	}
	catch (err) { throw err; }
	finally { return obj; }
}

async function getProfile(msg) {
	return T.get('users/lookup', { user_id: msg.message_create.sender_id });
}

// reformat timestamps of tweets and msgs
function setTimeFormat(obj) {
	obj.tweets.forEach(item => {
		item.created_at = timeFormatter(item.created_at);
	});
	obj.messages.forEach(item => {
		const time = new Date(parseInt(item.created_timestamp));
		item.created_timestamp = timeFormatter(time);
	});
	return obj;
}

app.listen(port, () => {
	console.log(`Application running on localhost:${port}`);
});