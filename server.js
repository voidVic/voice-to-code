'use strict';
// Imports dependencies and set up http server
const
  express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()), // creates express http server
  lib = require('./lib');

  process.env.ROOT_PATH = __dirname;
  var path = require('path');
  var cookieParser = require('cookie-parser');
  
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  
  app.use(body_parser.json());
  app.use(body_parser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  
  /////////////////////////////////

// Sets server port and logs message on success
app.listen(process.env.PORT || 4040, () => console.log('Server is listening'));

app.post('/classify/text',
            lib.nlp.classify.classifyText);

