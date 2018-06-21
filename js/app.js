const express = require('express');
const app = express();
const mainRoute = require('./mainRoute');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug');
app.use('/static', express.static('public'));

app.use(mainRoute);

app.listen(3000, () => {
    console.log('Application running on localhost:3000');
});

