require('dotenv').config();

const { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, ClientUtil } = require('discord-akairo');
const config = require("./config.js");
const List = require("list-array");
const BackEmbed = require('./embed.js');

const Youtube = require("ytdl-core-discord");
const active = new Map();

require("./struct/User.js");
require("./struct/Guild.js");
require("./struct/DMChannel.js");
require("./struct/TextChannel.js");
require("./language-framework.js");

global.consoleLines = {
	stdout: [],
	stderr: [],
};

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
        this.setDefaultSettings = (guild, blank = false, scan = true) => {
            let channels = guild.channels;

            let logchannel = scan ? channels.find(channel => channel.name === "discord-logs") : null;
            let welcomechannel = scan ? channels.find(channel => channel.name === "general") : null;
            let starboardchannel = scan ? channels.find(channel => channel.name === "starboard") : null;
            let mutedrole = scan ? guild.roles.find(role => role.name === "Muted") : null;

            let defaultsettings = {
                guildID: guild.id,
                logchan: {value: logchannel ? logchannel.id : '', type: "channel"},
                welcomechan: {value: welcomechannel ? welcomechannel.id : '', type: "channel"},
                welcomemessage: {type: 'array', arrayType: 'string', value: !blank ? [{value: "Welcome {{user}} to {{guild}}! Enjoy your stay", type: "string"}] : [] },
                leavemessage: {type: 'array', arrayType: 'string', value: !blank ? [{value: "Goodbye {{user}}! You'll be missed", type: 'string'}] : []},
                prefix: { value: config.prefix, type: "string" },
                makerboard: { value: "", type: "string" },
                starboardchannel: { value: starboardchannel ? starboardchannel.id : '', type: "channel" },
                levelup: { type: 'bool', value: 'true' },
                levelupmsgs: { type: 'array', arrayType: 'string', value: !blank ? [{value: "Congratulations {{user}}! You've leveled up to level {{level}}!", type: "string"}] : [] },
                mutedrole: { type: 'role', value: mutedrole ? mutedrole.id : '' },
            };

            let currentsettings = this.db.serverconfig.findOne({guildID: guild.id});
            if (currentsettings) {
                currentsettings.logchan = defaultsettings.logchan;
                currentsettings.welcomechan = defaultsettings.welcomechan;
                currentsettings.welcomemessage = defaultsettings.welcomemessage;
                currentsettings.leavemessage = defaultsettings.leavemessage;
                currentsettings.prefix = defaultsettings.prefix;
                currentsettings.makerboard = defaultsettings.makerboard;
                currentsettings.starboardchannel = defaultsettings.starboardchannel;
                currentsettings.levelup = defaultsettings.levelup;
                currentsettings.levelupmsgs = defaultsettings.levelupmsgs;
                currentsettings.mutedrole = defaultsettings.mutedrole;

                return this.client.db.serverconfig.update(currentsettings);
            } 
            return this.db.serverconfig.insert(defaultsettings);
        };

		this.commandHandler = new CommandHandler(this, {
			directory: './commands/',
			prefix: async msg => {
                if (msg.channel.type == "dm") return ['', config.prefix];
                if (msg.guild) {
                    try {
                        let serverconfig = this.db.serverconfig.findOne({ guildID: msg.guild.id }) || await this.setDefaultSettings(msg.guild);

                        if (serverconfig && serverconfig.prefix && serverconfig.prefix.value)
                            return serverconfig.prefix.value;
                    } catch(e) {
                        console.error(e)
                    }
                }

                return config.prefix;
            },
			handleEdits: true,
			commandUtil: true,
			commandUtilLifetime: 300000,
			storeMessages: true,
			allowMention: true,
            argumentDefaults: {
				prompt: {
					modifyStart: (msg, text) => text && `${msg.author} **::** ${text}\nType \`cancel\` to cancel this command.`,
					modifyRetry: (msg, text) => text && `${msg.author} **::** ${text}\nType \`cancel\` to cancel this command.`,
					timeout: msg => `${msg.author} **::** Time ran out, command has been cancelled.`,
					ended: msg => `${msg.author} **::** Too many retries, command has been cancelled.`,
					cancel: msg => `${msg.author} **::** Command has been cancelled.`,
					retries: 4,
					time: 30000
				}
			}
		}).resolver.addTypes(require('./utils/types.js'));

		this.inhibitorHandler = new InhibitorHandler(this, { directory: './inhibitors/' });
		this.listenerHandler = new ListenerHandler(this, { directory: './events/' }).setEmitters({
            process: process,
            commandHandler: this.commandHandler,
            inhibitorHandler: this.inhibitorHandler
        });

		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.inhibitorHandler.loadAll();

		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.load(process.cwd() +'/events/botHandler/ready.js');

		this.commandHandler.loadAll();

        this.moderation = require('./utils/moderation.js');

        this.util.embed = () => {return new BackEmbed();}
        this.util.pad = (n) => n < 10 ? "0"+n : ""+n;

        this.util.setDefaultStatus = (client) => {
            let userActivity = 'yamamura-bot.tk | '+client.guilds.size+' servers';
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

// This is used to debug the errors.
// Defaults to 20 lines max
const util = require('util');
var logStdout = process.stdout;
var logStderr = process.stderr;

console.log = function () {
  global.consoleLines.stdout.push(util.format.apply(null, arguments));
  logStdout.write(util.format.apply(null, arguments) + '\n');
	if (global.consoleLines.stdout.length > 20) global.consoleLines.stdout.shift();
}
console.error = function () {
  global.consoleLines.stderr.push(util.format.apply(null, arguments));
  logStderr.write(util.format.apply(null, arguments) + '\n');
	if (global.consoleLines.stderr.length > 20) global.consoleLines.stderr.shift();
}
