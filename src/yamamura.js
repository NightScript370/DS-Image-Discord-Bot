import 'cache-require-paths'
import "./utils/extraFunctions.js";

const translateModule = require('./langs/framework.js')

const AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler  = require('discord-akairo')
const owners, supportServer, prefix as _prefix, website, log as _log, token  = require("./config.js")
const join = require('path')
const BackEmbed = require('./embed.js')
const types = require('./utils/types.js')
const AudioModule = require('./utils/audio.js')
const DatabaseModule = require('./utils/database.js')
const ModerationModule = require('./utils/moderation/index.js')
const List = require("list-array")

import "./struct/User.js";
import "./struct/Guild.js";
import "./struct/DMChannel.js";
import "./struct/TextChannel.js";
import "./struct/GuildMember.js";

// This is used to debug the errors.
const format = require('util')
const maxLog = 20;

global.translate = translateModule;
console.backlogs = {
	debug: [],
	errors: [],
	others: []
};

console.log = function () {
	let logged = format.apply(null, arguments);

	console.backlogs.others.push(logged);
	process.stdout.write(logged + '\n');

	if (console.backlogs.others.length > maxLog)
		console.backlogs.others.shift();
}
console.error = function () {
	let logged = format.apply(null, arguments);

	console.backlogs.errors.push(logged);
	process.stderr.write(logged + '\n');

	if (console.backlogs.errors.length > maxLog)
		console.backlogs.errors.shift();
}

class BotClient extends AkairoClient {
	constructor() {
		super({
			ownerID: owners,
		}, {
			disableEveryone: true,
			disabledEvents: ['TYPING_START'],
			partials: ['MESSAGE', 'CHANNEL']
		});

		this.db = DatabaseModule;
		this.supportServer = supportServer;

		this.commandHandler = new CommandHandler(this, {
			directory: join(__dirname, 'commands'),
			prefix: msg => {
				let prefix;

				if (msg.guild) {
					try {
						try {
							prefix = msg.guild.config.data.prefix;
						} catch (e) {
							prefix = DatabaseModule.serverconfig.findOne({ guildID: msg.guild.id }).prefix;
						}
					} catch(e) {
						console.error(e)
						prefix = _prefix;
					}
				} else
					prefix = ['', _prefix]

				if (prefix.value)
					prefix = prefix.value;

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

		this.inhibitorHandler = new InhibitorHandler(this, { directory: join(__dirname, 'inhibitors') });
		this.listenerHandler = new ListenerHandler(this, { directory: join(__dirname, 'events') });
		this.listenerHandler.setEmitters({
			process: process,
			inhibitorHandler: this.inhibitorHandler
		});

		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.load(join(__dirname, 'events', 'botHandler', 'ready'));

		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.inhibitorHandler.loadAll();

		this.moderation = ModerationModule;

		this.util.embed = (embedObject={}) => new BackEmbed(embedObject);
		this.util.pad = (n) => n < 10 ? "0"+n : ""+n;

		this.util.setDefaultStatus = (userActivity = (website.url).replaceAll(['https://', 'http://'], '') + ' | Mention me for help information') => {
			if (!this.user.presence.activity || (this.user.presence.activity && this.user.presence.activity.name !== userActivity))
				return this.user.setActivity(userActivity);
			else
				return this.user.presence;
		};

		this.audio = AudioModule;

		this.log = _log;
	}
}

const client = new BotClient();
client.login(token);

global.List = List;