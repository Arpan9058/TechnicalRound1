require('dotenv').config();
const express = require('express');
const path = require('path');
const routes = require('./routes/index'); 
const app = express();
const port = 5000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes); 

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});