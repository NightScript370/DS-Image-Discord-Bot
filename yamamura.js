console.backlogs = {
	debug: [],
	errors: [],
	others: []
};

// This is used to debug the errors.
const util = require('util');
const maxLog = 20;

console.log = function () {
	let logged = util.format.apply(null, arguments);

	console.backlogs.others.push(logged);
	process.stdout.write(logged + '\n');

	if (console.backlogs.others.length > maxLog)
		console.backlogs.others.shift();
}
console.error = function () {
	let logged = util.format.apply(null, arguments);

	console.backlogs.errors.push(logged);
	process.stderr.write(logged + '\n');

	if (console.backlogs.errors.length > maxLog)
		console.backlogs.errors.shift();
}


try { import('cache-require-paths') } catch {}
import("./utils/extraFunctions.js");

import * as translateModule from './langs/framework';
global.translate = translateModule;

import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import { owners, supportServer, prefix as _prefix, website, log as _log, token } from "./config";
import * as List from "list-array";
import * as BackEmbed from './embed';
import * as types from './utils/types';
import * as AudioModule from './utils/audio';

import("./struct/User");
import("./struct/Guild");
import("./struct/DMChannel");
import("./struct/TextChannel");
import("./struct/GuildMember");

class YamamuraClient extends AkairoClient {
	constructor() {
		super({
			ownerID: owners,
		}, {
			disableEveryone: true,
			disabledEvents: ['TYPING_START'],
			partials: ['MESSAGE', 'CHANNEL']
		});

		this.db = require('./utils/database.js');
		this.supportServer = supportServer;

		this.commandHandler = new CommandHandler(this, {
			directory: './commands/',
			prefix: msg => {
				let prefix;

				if (msg.guild) {
					try {
						prefix = msg.guild.config.data.prefix;
						if (prefix.value)
							prefix = prefix.value;
					} catch(e) {
						console.error(e)
						prefix = _prefix;
					}
				} else
					prefix = ['', _prefix]

				return prefix;
			},
			handleEdits: true,
			commandUtil: true,
			commandUtilLifetime: 300000,
			storeMessages: true,
			allowMention: true,
			argumentDefaults: {
				prompt: {
					modifyStart: (message, text) => text && `${message.author} **::** ${global.translate(message.author.lang, text)}\n` + global.translate(message.author.lang, "Type `cancel` to cancel this command."),
					modifyRetry: (message, text) => text && `${message.author} **::** ${global.translate(message.author.lang, text)}\n` + global.translate(message.author.lang, "Type `cancel` to cancel this command."),
					timeout: message => `${message.author} **::** ` + global.translate(message.author.lang, "Time ran out, command has been cancelled."),
					ended: message => `${message.author} **::** ` + global.translate(message.author.lang, "Too many retries, command has been cancelled."),
					cancel: message => `${message.author} **::** ` + global.translate(message.author.lang, "Command has been cancelled."),
					retries: 4,
					time: 30000
				}
			}
		})

		this.commandHandler.resolver.addTypes(types);
		this.commandHandler.games = new Map();

		this.inhibitorHandler = new InhibitorHandler(this, { directory: './inhibitors/' });
		this.listenerHandler = new ListenerHandler(this, { directory: './events/' });
		this.listenerHandler.setEmitters({
			process: process,
			inhibitorHandler: this.inhibitorHandler
		});

		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.load(process.cwd() +'/events/botHandler/ready.js');

		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.inhibitorHandler.loadAll();

		this.moderation = require('./utils/moderation.js');

		this.util.embed = () => {return new BackEmbed();}
		this.util.pad = (n) => n < 10 ? "0"+n : ""+n;

		this.util.setDefaultStatus = (client) => {
			let userActivity = (website.url).replaceAll(['https://', 'http://'], '') + ' | Mention me for help information';
			if (!client.user.presence.activity || (client.user.presence.activity && client.user.presence.activity.name !== userActivity))
				return client.user.setActivity(userActivity);
			else
				return client.user.presence;
		};

		this.audio = AudioModule;

		this.log = _log;
	};
}

const client = new YamamuraClient();
client.login(token);

global.List = List;
export default client;
