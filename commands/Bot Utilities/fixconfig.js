const { inspect } = require('util')
const Command = require('../../struct/Command');
const { findType } = require("../../Configuration.js");

module.exports = class FixConfigCommand extends Command {
	constructor() {
		super('fixconfig', {
			aliases: ['fixconfig', 'fixconf'],
			category: 'Bot Utilities',
			description: {
				content: 'Fixes the server configuration in case it\'s not set properly.',
			},
			ownerOnly: true
		});
	}

	async exec(msg) {
		const types = {
			logchan: "channel",
			welcomechan: "channel",
			welcomemessage: "array",
			leavemessage: "string",
			prefix: "string",
			makerboard: "string",
			starboardchannel: "channel",
			levelup: "bool",
			levelupmsgs: "array",
			mutedrole: "role"
		}

		this.client.guilds.forEach(async guild => {
			let data = this.client.db.serverconfig.findOne({guildID: guild.id});

			console.log(`${guild.name}'s server prechange`, data)
			for (const prop in data) {
				if (["meta", "$loki", "exec", "guildID"].includes(prop)) continue;

				const value = data[prop];
				console.log(prop, value, types[prop]);

				if (!value || !value.value || typeof value == "string")
					data[prop] = {type: types[prop], arrayType: "string", value: value || findType(types[prop]).nullValue};
		        if (types[prop] == "array" && !Array.isArray(data[prop].value)) {
					var array0 = data[prop].value;
					if (!array0 || !array0.value || typeof array0 == "string") array0 = {type: "string", value: array0};
					data[prop].value = [array0];
				}

				console.log(prop, data[prop])
			}
			console.log(`${guild.name}'s server postchange`, data)
		});

		msg.util.send("Done.")
	}
};