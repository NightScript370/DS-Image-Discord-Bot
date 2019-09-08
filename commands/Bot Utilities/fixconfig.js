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

				if (types[prop] == "array")
					data[prop].value = convert(value.value, types[prop]) || findType(types[prop]).nullValue;

				unconvert(data[prop]);

				console.log(prop, data[prop])
			}
			console.log(`${guild.name}'s server postchange`, data)
		});

		msg.util.send("Done.")
	}
};

function unconvert(object) {
	if (object.type == 'array')
		return object;

	if (typeof object.value !== "string") {
		while (object.value instanceof Array)
			object.value = object.value[0] || '';

		while (typeof object.value == "object")
			object.value = object.value.value;
	}

	return object;
}

function convert(array, propType) {
    if (typeof array == 'string') {
        if (!array.trim().length)
            return [];
        return [{ type: propType, value: array }];
    };

    if (!(array instanceof Array))
        return array;

	let cfg = [];
	for (var i = 0; i < array.length; i++) {
		cfg.push({ type: propType, value: array[i] });
	};

	return cfg;
};