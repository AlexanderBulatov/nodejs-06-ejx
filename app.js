const express = require('express');

const router = require('./routes/index');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

const { PORT = 3000 } = process.env;
app.use('/public', express.static(`${__dirname}/public`));

app.use('/', router);

app.listen(PORT);

// {
//   "title": "RandomYrt",
//   "description": "TRRTTshshhs",
//   "authors": "",
//   "favorite": "",
//   "fileCover": "",
//   "fileName": ""
// }
