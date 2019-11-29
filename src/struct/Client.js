import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import { owners, supportServer, prefix as _prefix, website, log as _log } from "../config.js";
import { join } from "path";
import dirname from 'es-dirname';;
import * as BackEmbed from '../embed.js';
import * as types from '../utils/types.js';
import * as AudioModule from '../utils/audio.js';
import DatabaseModule from '../utils/database.js';
import * as ModerationModule from '../utils/moderation/index.js';

export default class YamamuraClient extends AkairoClient {
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
			directory: join(dirname(), '..', 'commands'),
			prefix: msg => {
				let prefix;

				if (msg.guild) {
					try {
						prefix = DatabaseModule.serverconfig.serverconfig.findOne({ guildID: msg.guild.id }).prefix;
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

		this.inhibitorHandler = new InhibitorHandler(this, { directory: join(dirname(), '..', 'inhibitors') });
		this.listenerHandler = new ListenerHandler(this, { directory: join(dirname(), '..', 'events') });
		this.listenerHandler.setEmitters({
			process: process,
			inhibitorHandler: this.inhibitorHandler
		});

		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.load('../events/botHandler/ready');

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