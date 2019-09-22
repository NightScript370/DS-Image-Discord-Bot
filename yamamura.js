require('dotenv').config();

const { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, ClientUtil } = require('discord-akairo');
const config = require("./config.js");
const List = require("list-array");
const BackEmbed = require('./embed.js');

require("./struct/User.js");
require("./struct/Guild.js");
require("./struct/DMChannel.js");
require("./struct/TextChannel.js");
require("./langs/framework.js");

console.logs = {
	log: [],
	err: [],
};

// This is used to debug the errors.
// Defaults to 20 lines max
const util = require('util');
var logStdout = process.stdout;
var logStderr = process.stderr;

console.log = function () {
	console.logs.log.push(util.format.apply(null, arguments));
	logStdout.write(util.format.apply(null, arguments) + '\n');
	if (console.logs.log.length > 20) console.logs.log.shift();
}
console.error = function () {
	console.logs.err.push(util.format.apply(null, arguments));
	logStderr.write(util.format.apply(null, arguments) + '\n');
	if (console.logs.err.length > 20) console.logs.err.shift();
}


class YamamuraClient extends AkairoClient {
	constructor() {
		super({
			ownerID: config.owners,
		}, {
			disableEveryone: true,
			disabledEvents: ['TYPING_START'],
			partials: ['MESSAGE', 'CHANNEL']
		});

		this.db = require('./utils/database.js');

		this.commandHandler = new CommandHandler(this, {
			directory: './commands/',
			prefix: msg => {
				let prefix;

				if (msg.guild) {
					try {
						prefix = msg.guild.config.data.prefix;
					} catch(e) {
						console.error(e)
						prefix = config.prefix
					}
				} else {
					prefix = ['', config.prefix]
				}

				return prefix;
			},
			handleEdits: true,
			commandUtil: true,
			commandUtilLifetime: 300000,
			storeMessages: true,
			allowMention: true,
			argumentDefaults: {
				prompt: {
					modifyStart: (message, text) => text && `${message.author} **::** ${global.getString(message.author.lang, text)}\n` + global.getString(message.author.lang, "Type `cancel` to cancel this command."),
					modifyRetry: (message, text) => text && `${message.author} **::** ${global.getString(message.author.lang, text)}\n` + global.getString(message.author.lang, "Type `cancel` to cancel this command."),
					timeout: message => `${message.author} **::** ` + global.getString(message.author.lang, "Time ran out, command has been cancelled."),
					ended: message => `${message.author} **::** ` + global.getString(message.author.lang, "Too many retries, command has been cancelled."),
					cancel: message => `${message.author} **::** ` + global.getString(message.author.lang, "Command has been cancelled."),
					retries: 4,
					time: 30000
				}
			}
		})

		this.commandHandler.resolver.addTypes(require('./utils/types.js'));
		this.commandHandler.games = new Map();

		this.inhibitorHandler = new InhibitorHandler(this, { directory: './inhibitors/' });
		this.listenerHandler = new ListenerHandler(this, { directory: './events/' }).setEmitters({
			process: process,
			inhibitorHandler: this.inhibitorHandler
		});

		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.inhibitorHandler.loadAll();

		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.load(process.cwd() +'/events/botHandler/ready.js');

		this.moderation = require('./utils/moderation.js');

		this.util.embed = () => {return new BackEmbed();}
		this.util.pad = (n) => n < 10 ? "0"+n : ""+n;

		this.util.setDefaultStatus = (client) => {
			let userActivity = 'yamamura-bot.tk | Mention me for help information';
			if (!client.user.presence.activity || (client.user.presence.activity && client.user.presence.activity.name !== userActivity))
				return client.user.setActivity(userActivity);
			else
				return client.user.presence;
		};

		this.audio = require('./utils/audio.js');

		this.log = config.log;
	};
}

const client = new YamamuraClient();
client.login(config.token);

function isEmpty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}

global.List = List;
module.exports = client;