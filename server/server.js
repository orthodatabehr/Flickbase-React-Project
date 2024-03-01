const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}?retryWrites=true&w=majority&appName=${process.env.DB_APP}`;
mongoose.connect(mongoURI);

const bodyParser = require('body-parser');

const {xss} = require('express-xss-sanitizer');
const mongoSanitize = require('express-mongo-sanitize');

const routes = require('./routes');

const passport = require('passport');
const {jwtStrategy} = require('./middleware/passport');

const {handleError,convertToApiError} = require('./middleware/apiError')


// PARSING
app.use(bodyParser.json());

// SANITIZE
app.use(xss());
app.use(mongoSanitize());

// PASSPORT
app.use(passport.initialize());
passport.use('jwt',jwtStrategy);

// ROUTES
app.use('/api',routes);

//
app.use(convertToApiError)

// ERROR HANDLING MIDDLEWARE
app.use((err,req,res,next)=>{
    handleError(err,res)
});

const port = process.env.port || 3001;
app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
});