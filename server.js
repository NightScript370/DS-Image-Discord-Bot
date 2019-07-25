const client = require("./yamamura.js")
const DBL = require("dblapi.js");
const config = require("./config.js");
const util = require("util");
const http = require('http');
const List = require("list-array") // My module, for ease of use ~Samplasion
const isEmpty = (value) => {
  return (value == null || value.length === 0);
}
// ================================================================
// get all the tools we need
// ================================================================
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var routes = require('./routes.js');
var app = express();

// ================================================================
// setup our express application
// ================================================================
app.use(express.static(process.cwd() + '/views/public'));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use('/api/discord', require('./discord_oauth.js')(client));
app.use((err, req, res, next) => {
  switch (err.message) {
    case 'NoCodeProvided':
      return res.status(400).send({
        status: 'ERROR',
        error: err.message,
      });
    default:
      return res.status(500).send({
        status: 'ERROR',
        error: err.message,
      });
  }
});
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);
// ================================================================
// set up modules
// ================================================================
app.locals.client = client;
app.locals.isEmpty = isEmpty;
app.locals.util = util;
app.locals.getParams = query => {
    return query
        ? (/^[?#]/.test(query) ? query.slice(1) : query)
            .split('&')
            .reduce((params, param) => {
                    let [key, value] = param.split('=');
                    params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
                    return params;
                }, {}
            )
        : {}
};
app.locals.List = List
app.locals.require = require;
app.locals.config = config;
// ================================================================
// setup routes
// ================================================================
routes(app, client);
// ================================================================
// start our server
// ================================================================
const server = http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
const dbl = new DBL(config.DBLtoken, { webhookAuth: config.DBLPass, webhookServer: server });
dbl.webhook.on('ready', hook => {
  console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
});
dbl.webhook.on('vote', vote => {
  if (vote.type == 'test')
    return console.log('test successful')
  let message;

  try {
    let fetchedUser = client.users.fetch(vote.user);
    message = `${fetchedUser.tag} just upvoted!`;
  } catch(e) {
    message = `${vote.user} upvoted`
  }
  client.channels.get(config.logging).send(message);
  console.log(`User with ID ${vote.user} just voted!`);
});
