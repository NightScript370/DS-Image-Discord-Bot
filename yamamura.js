require('dotenv').config()

const { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, ClientUtil } = require('discord-akairo');
const config = require("./config.js");
const List = require("list-array");
const BackEmbed = require('./embed.js');

const Youtube = require("ytdl-core");
const YTDL = require("ytdl-core-discord");
const active = new Map();

require("./struct/User.js");
require("./struct/Guild.js");
require("./language-framework.js");

const DBL = require("dblapi.js");

class MyClient extends AkairoClient {
	constructor() {
		super({
			ownerID: config.owners,
		}, {
			disableEveryone: true,
			disabledEvents: ['TYPING_START'],
            partials: ['MESSAGE', 'CHANNEL']
		});

        this.db = require('./utils/database.js');
        this.setDefaultSettings = (entry) => {
            let logchanid = "";
            let welchanid = "";
            let starchanid = "";
            let publiclogid = "";

            if (entry.guild.channels.find(logchan => logchan.name === "moderator-logs")) publiclogid = entry.guild.channels.find(logchan => logchan.name === "moderator-logs").id;
            if (entry.guild.channels.find(logchan => logchan.name === "discord-logs"))   logchanid = entry.guild.channels.find(logchan => logchan.name === "discord-logs").id;
            if (entry.guild.channels.find(logchan => logchan.name === "general"))        welchanid = entry.guild.channels.find(logchan => logchan.name === "general").id;
            if (entry.guild.channels.find(logchan => logchan.name === "starboard"))      starchanid = entry.guild.channels.find(logchan => logchan.name === "starboard").id;

            let defaultsettings = {
                guildID: entry.guild.id,
                logchan: {value: logchanid, type: "channel"},
                welcomechan: {value: welchanid, type: "channel"},
                welcomemessage: {type: 'array', arrayType: 'string', value: [{value: "Welcome {{user}} to {{guild}}! Enjoy your stay", type: "string"}] },
                leavemessage: {value: "Goodbye {{user}}! You'll be missed", type: "string"},
                prefix: {value: config.prefix, type: "string"},
                makerboard: {value: "", type: "string"},
                starboardchannel: {value: starchanid, type: "channel"},
                levelup: { type: 'bool', value: 'true' },
                levelupmsgs: { type: 'array', arrayType: 'string', value: [{value: "{{coin}} Congratulations {{user}}! You've leveled up to level {{level}}! {{coin}}", type: "string"}] }
            };

            return this.db.serverconfig.insert(defaultsettings);
        };

        this.dbl = new DBL(config.DBLtoken, this);
        this.URL = config.url;

		this.commandHandler = new CommandHandler(this, {
			directory: './commands/',
			prefix: async msg => {
                if (msg.channel.type == "dm") return ['', config.prefix];
                if (msg.guild) {
                    try {
                        let serverconfig = this.db.serverconfig.findOne({ guildID: msg.guild.id }) || await this.setDefaultSettings(msg);

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
		});
		this.commandHandler.resolver.addType('question', (message, phrase) => {
			if (!phrase) return null;

			if (phrase.endsWith('?')) {
				return phrase;
			}

			return null;
		});
		this.commandHandler.resolver.addType('text-fun', async (message, phrase) => {
			if (phrase) return phrase;

            let msgs = await message.channel.messages.fetch({
                limit: 100,
            });

            let msgArr = msgs.array().sort((a, b) => a.createdAt - b.createdAt)
            let target = null;
            // Get the latest one that has text
            for (let i = 99; i >= 0; i--) {
                let msg = msgArr[i];
                if (message == msg) continue;
                if (msg && !isEmpty(msg.cleanContent)) {
                    target = msg;
                    break;
                }
            }

            if (target) {
                console.log(msg);
                return target.cleanContent;
            }

			return null;
		});
        this.commandHandler.resolver.addType('user-commando', async (message, user) => {
            if (!user) return null;

            const matches = user.match(/^(?:<@!?)?([0-9]+)>?$/);
            if(matches) {
                try {
                    const fetchedUser = await message.client.users.fetch(matches[1]);
                    if(!fetchedUser) return null;
                    return fetchedUser;
                } catch(err) {
                    console.error(err);
                }
            }

            let userFound = null;

            if (userSearch(message, user.toLowerCase())) return userSearch(message, user.toLowerCase());
            let tmp_user = user.split(" ")
            while (!userFound && tmp_user.length > 1) {
                tmp_user.pop()
                userFound = userSearch(message, tmp_user.join(" ").toLowerCase());
            }

            return userFound;

            function userSearch(message, term) {
                if(message.guild) {
                    let guildMember = message.guild.members.find(mem => mem.displayName.toLowerCase() === term);
                    if (guildMember) {
                        console.log(`I found ${guildMember.displayName} (#${guildMember.user.id}) from the current guild (${message.guild.name}) using the term "${term}" for ${message.author.username} (#${message.author.id})`)
                        return guildMember.user;
                    }
                }

                let inexactUsers = message.client.users.filter(memberFilterInexact(term));
                if(inexactUsers.size === 0) return null;
                if(inexactUsers.size === 1) {
                    return inexactUsers.first();
                }
    
            const exactUsers = inexactUsers.filter(memberFilterExact(term));
            if(exactUsers.size === 1)  return exactUsers.first();
    
            if(exactUsers.size > 0) inexactUsers = exactUsers;
            return inexactUsers.first();
          }
    
          function memberFilterExact(search) {
            return mem => mem.username.toLowerCase() === search ||
              `${mem.username.toLowerCase()}#${mem.discriminator}` === search;
          }
    
          function memberFilterInexact(search) {
            return mem => mem.username.toLowerCase().includes(search.toLowerCase()) ||
              `${mem.username.toLowerCase()}#${mem.discriminator}`.includes(search.toLowerCase());
          }
		});
    this.commandHandler.resolver.addType('image', async (message, argument) => {
      const fileTypeRe = /\.(jpe?g|png|gif|bmp)$/i;
      const base64 = /data:image\/(jpe?g|png|gif|bmp);base64,([^\"]*)/;
      const attachment = message.attachments.first();

      function validateAttachment(attachment) {
        if (!attachment) return false;
        if (!attachment.height || !attachment.width) return false;
        if (attachment.size > 8e+6) return false;
        if (!fileTypeRe.test(attachment.name)) return false;

        return attachment.url;
      }

      if (attachment && validateAttachment(attachment)) {
        return [ attachment.url ];
      } else if (argument && !isEmpty(argument)) {
        let user = await client.commandHandler.resolver.types.get("user-commando")(message, argument);

        let splittedarguments = argument.split(' ');
        let returnargument = [];

        for (var splittedargument of splittedarguments) {
          if (fileTypeRe.test(splittedargument.split(/[#?]/gmi)[0]))
            returnargument.push(splittedargument);
        }

        if (!isEmpty(returnargument)) {
          return returnargument;
        } else if (user && !isEmpty(user.displayAvatarURL({format: 'png'}))) {
          return [ user.displayAvatarURL({ format: 'png', size: 512 }) ];
        }
      } else {
        // Check previous messages
        const channel = message.channel;
        let msgs = await channel.messages.fetch({
          limit: 100,
        });
        let att = undefined;
        let attachments = List.fromArray(msgs.array()).filter(msg => !!msg.attachments && !!msg.attachments.first()).reverse().forEach(msg => {
          att = validateAttachment(msg.attachments.first());
        });
        if (!att) return null;
        return [ att ];
      }

      return null
		});
    this.commandHandler.resolver.addType('rps', (message, move) => {
			let returnvalue = false;
      if (!move) return null;

      let possible = [
        '🤚', '✋', '🙌', '📰', '🗞', 'p', 'paper', '🙋', '🖐', // Paper
        '🖖', '✌', '✂', 'scissors', 's',
        'rock', 'r', '🤜'
      ];

      for (var emoji of possible) {
			  if (move == emoji) {
				  returnvalue = true;
			  }
      }

      if (returnvalue) return move;
			return null;
		});
    this.commandHandler.resolver.addType('externalIP', (message, address) => {
			if (!address) return null;

      if (!/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:0*(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9]))?$/.test(address)) {
        return null;
      }

      if (address.split(':')[0] == '127.0.0.1') {
        return null;
      }

			return address;
		});

		this.inhibitorHandler = new InhibitorHandler(this, {
			directory: './inhibitors/'
		});

		this.listenerHandler = new ListenerHandler(this, {
			directory: './events/'
		});
    this.listenerHandler.setEmitters({
      process: process,
      commandHandler: this.commandHandler,
      inhibitorHandler: this.inhibitorHandler,
      listenerHandler: this.listenerHandler,
      dbl: this.dbl
    });

		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.inhibitorHandler.loadAll();

		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.loadAll();

		this.commandHandler.loadAll();

    this.moderation = require('./utils/moderation.js');
    this.config = config;

    this.util.embed = () => {return new BackEmbed();}
    this.util.pad = (n) => n < 10 ? "0"+n : ""+n;

    this.audio = {};
    this.audio.active = new Map();
    this.audio.play = async (msg, client, data) => {
        let playing;

        let relinfo = await Youtube.getInfo(`https://www.youtube.com/watch?v=${data.queue[0].related[0].id}`);
        let embed = client.util.embed()
            .setTitle(`<:music:494355292948004874> Now Playing: ${data.queue[0].songTitle}`, data.queue[0].url)
            .setColor("#FF006E")
            .addField("Requester", data.queue[0].requester, true)
            .addField("Duration", data.queue[0].length, true)
            .addField("Related", `**[${data.queue[0].related[0].title}](${relinfo.video_url})** by ${data.queue[0].related[0].author}`)
            .setTimestamp(data.queue[0].timerequest)
            .setThumbnail(data.queue[0].thumbnail)
            .setServerFooter(msg, true);

        try {
            let lastChannelMessage = await msg.channel.lastMessage;
            if (lastChannelMessage.author.id == client.user.id) {
                playing = await lastChannelMessage.edit({embed: embed});
            } else {
                playing = await msg.channel.send({embed: embed});
            }
        } catch (e) {
            playing = await msg.channel.send({embed: embed});
        }

        // YTDL is for downloading while Youtube is for info, since ytdl-discord doesn't have info
        data.dispatcher = data.connection.play(await YTDL(data.queue[0].url), { type: 'opus', volume: false })
                            .on('error', err => {
                                console.error('Error occurred in stream dispatcher:', err);
                                playing.edit(`An error occurred while playing the song: ${err}`);
                                data.dispatcher.guildID = data.guildID;
                                client.audio.finish(msg, client, data.dispatcher);
                            });
        data.dispatcher.guildID = data.guildID;

        data.dispatcher.once('end', function() {
            client.audio.finish(msg, client, this);
        });
    };
    this.audio.finish = async (msg, client, dispatcher) => {
	    let fetched = await client.audio.active.get(dispatcher.guildID);
	    try {
		    const vcsize = await client.guilds.get(dispatcher.guildID).me.voice.channel.members.filter(val => val.id !== client.user.id).size;
		    if(vcsize == 0) {
			    active.delete(dispatcher.guildID);

          var vc = await client.guilds.get(dispatcher.guildID).me.voice.channel;
          if (vc) return vc.leave();
          dispatcher.destroy()
        }

        await fetched.queue.shift();
        if(fetched.queue.length > 0) {
          await client.audio.active.set(dispatcher.guildID, fetched);
          client.audio.play(msg, client, fetched);
        } else {
          client.audio.active.delete(dispatcher.guildID);

          var vc = await client.guilds.get(dispatcher.guildID).me.voice.channel;
          if (vc) vc.leave();
          dispatcher.destroy()
        }
      } catch(error) {
        console.error(error);

        var vc = await client.guilds.get(dispatcher.guildID).me.voice.channel;
        if (vc) vc.leave();
        dispatcher.destroy()
      }
    }
	};
}

const client = new MyClient();
client.login(config.token);

function isEmpty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}

global.List = List;

setTimeout(function(){
  module.exports = client;

  // Actually start the server
  require('./server.js')
}, 2000);
