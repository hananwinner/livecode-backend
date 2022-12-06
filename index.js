const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const debug = require('debug')('app:startup');
const app = express();
const livecodes = require('./routes/livecodes');

mongoose.connect('mongodb://root:example@localhost:27017')
.then(() => console.log('connected to mongodb.'))
.catch(err => console.error('Could not connect to mongodb!', err))


app.use(morgan('tiny'));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));
app.use(helmet());
app.use('/api/livecodes', livecodes);


app.get('/', (req, res) => {
    res.send('hello!');
} );


app.listen(3000, () => console.log(`Listening on port 3000..`));