const express = require('express');
const ejs = require('ejs');
const path = require('path');

const app = express();


// IMPORT ROUTES
const routes = require('./routes/routes.js');

// SETTINGS
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MIDDLEWARES
// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Body-parser de express
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Rutas
app.use(routes);


/* SERVER LISTENING */
app.listen(app.get('port'), () => {
    console.log(`Server listening on http://localhost:${app.get('port')}`);
});
