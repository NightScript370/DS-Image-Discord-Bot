const {website: websiteConfig} = require("../config.js");
const List = require("list-array");
const path = require("path");
const fs = require('fs')
const routers = fs.readdirSync(path.join(process.cwd(), 'website', 'router'));

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const http = require('http');
const { Strategy } = require("passport-discord");

module.exports = (client) => {
	let website = {};
	website.URL = websiteConfig.url;

	website.passport = require("passport");
	website.passport.serializeUser((user, done) => {
		done(null, user);
	});
	website.passport.deserializeUser((obj, done) => {
		done(null, obj);
	});

	website.passport.use(new Strategy({
		clientID: client.user.id,
		clientSecret: websiteConfig.client_secret,
		callbackURL: `${website.URL}/servers/login`,
		scope: ["identify", "guilds"]
	}, function(accessToken, refreshToken, profile, done) {
		process.nextTick(function() {
			return done(null, profile);
		});
	}));

	website.express = express()
		.use(bodyParser.json())
		.use(bodyParser.urlencoded({extended : true}))
		.engine("ejs", require("ejs").renderFile)
		.use(express.static(path.join(__dirname, "/public")))
		.set("view engine", "ejs")
		.set("views", path.join(__dirname, "pages"))
		.set('trust proxy', 1)
		.use(session({
			secret: 'Yamamura Dashboard',
			resave: false,
			saveUninitialized: false
		}))
		.use(website.passport.initialize())
		.use(website.passport.session())
		.use((err, req, res, next) => {
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
		})
		.set('port', process.env.PORT || 3000);

	try {
		const helmet = require('helmet');
		website.express.use(helmet());
	} catch (e) {
		console.error("[WEBSITE] Failed to load Helmet!");
	}

	try {
		const compression = require('compression');
		website.express.use(compression())
	} catch (e) {
		console.error("[WEBSITE] Failed to load compression!");
	}

	try {
		const morgan = require('morgan');
		website.express.use(morgan('dev'))
	} catch (e) {
		console.error("[WEBSITE] Failed to load Morgan!");
	}

	let routerModule
	for (let router of routers) {
		routerModule = require("./router/" + router);
		website.express.use(routerModule.id, routerModule.router(client))
	}
	
	website.express.get('*', (request, response) => response.redirect("/"));

	// ===================
	// set up modules
	// ===================
	website.express.locals.client = client;
	website.express.locals.inviteBot = `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot`;
	website.express.locals.isEmpty = isEmpty;
	website.express.locals.util = require("util");
	website.express.locals.getParams = query => {
		if (!query) return {};

		return (/^[?#]/.test(query) ? query.slice(1) : query)
			.split('&')
			.reduce((params, param) => {
				let [key, value] = param.split('=');
				params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
				return params;
			}, {})
	};
	website.express.locals.List = List;
	website.express.locals.require = require;

	website.server = http.createServer(website.express);
	website.server.listen(website.express.get('port'));

	return website
}

function isEmpty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}