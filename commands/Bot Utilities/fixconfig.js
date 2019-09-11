const { inspect } = require('util')
const Command = require('../../struct/Command');
const { findType } = require("../../Configuration.js");

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
		this.client.guilds.forEach(async guild => {
			let data = this.client.db.serverconfig.findOne({guildID: guild.id});

			console.log(`${guild.name}'s server prechange`, data)
			for (const prop in data) {
				if (["meta", "$loki", "exec", "guildID"].includes(prop)) continue;

				const value = data[prop];
				console.log(prop, value, types[prop]);

				if (!value || !value.value || typeof value == "string")
					data[prop] = {type: types[prop], arrayType: "string", value: value || findType(types[prop]).nullValue};

				if (types[prop] == "array") {
					data[prop].value = convert(value.value, types[prop]) || findType(types[prop]).nullValue;
				}

				if (value.type == 'array') {
					if (value.value == null)
						value.value = [];
						
					else if (isObject(value.value))
						value.value = [value.value];
					else if (!(value.value instanceof Array))
						value.value = [{type: 'string', value: value.value}];

					for (var val in value.value) {
						data[prop].value[0] = unconvert(val);
					}

				} else
					data[prop] = unconvert(value);

				console.log(prop, data[prop])
			}
			console.log(`${guild.name}'s server postchange`, data)
		});

		msg.util.send("Done.")
	}
};

function unconvert(object) {
    let counter = 0;
    
    while (typeof object.value !== "string" && counter !== 10) {
        while (object.value instanceof Array)
            object.value = object.value[0] || '';

        while (isObject(object.value.value))
            object.value = object.value.value;

        counter++;
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

function isObject(val) {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
}