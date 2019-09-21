const { Structures } = require("discord.js");
const { getKey } = require('./../Configuration.js');
const db = require('../utils/database.js')

// This extends Discord's native Guild class with our own methods and properties
module.exports = Structures.extend("Guild", Guild => {
	return class YamamuraGuild extends Guild {
		constructor(...args) {
			super(...args);
			this.config = {
				setDefaultSettings: (blank = false, scan = true) => {
					let channels = this.channels;

					let logchannel = scan ? channels.find(channel => channel.name === "discord-logs") : null;
					let welcomechannel = scan ? channels.find(channel => channel.name === "general") : null;
					let starboardchannel = scan ? channels.find(channel => channel.name === "starboard") : null;
					let mutedrole = scan ? this.roles.find(role => role.name === "Muted") : null;

					let defaultsettings = {
						guildID: this.id,
						logchan: logchannel ? logchannel.id : '',
						welcomechan: welcomechannel ? welcomechannel.id : '',
						welcomemessage: !blank ? ["Welcome {{user}} to {{server}}! Enjoy your stay"] : [],
						leavemessage: !blank ? ["Goodbye {{user}}! You'll be missed"] : [],
						prefix: config.prefix,
						makerboard: "",
						starboardchannel: starboardchannel ? starboardchannel.id : '',
						levelup: true,
						levelupmsgs: !blank ? ["Congratulations {{user}}! You've leveled up to level {{level}}!"] : [],
						mutedrole: mutedrole ? mutedrole.id : '',
					};

					let currentsettings = db.serverconfig.findOne({guildID: this.id});
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

						return db.serverconfig.update(currentsettings);
					}

					return db.serverconfig.insert(defaultsettings);
				},
				get data() {
					return db.serverconfig.findOne({ guildID: this });
				}
			}
		}
	}
})