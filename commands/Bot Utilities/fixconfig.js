const Command = require('../../struct/Command');
const { findType, settingProps } = require("../../Configuration.js");

const isObject = (val) => typeof val === 'object' && !(val instanceof Array) && val !== null;

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
		this.client.guilds.forEach(guild => {
			let data = guild.config.data;

			console.log(`${guild.name}'s server prechange`, data)
			for (const prop in data) {
				if (["meta", "$loki", "exec", "guildID"].includes(prop)) continue;

				let value = data[prop];
				console.log(`Old ${prop}`, value, settingProps[prop]);

				if (!value)
					value = findType(prop).nullValue;

				while (value.value) {
					value = value.value;
				}

				let numrefresh = 0;

				if (!settingProps[prop].endsWith(':ex')) {
					while (value instanceof Array && value.length && numrefresh < 100) {
						value = value[0];
						numrefresh++;
					}
				} else {
					if (!(Array.isArray(value)))
						value = [ value ];

					for (var valueinvalue of value) {
						numrefresh = 0;

						while (typeof valueinvalue !== 'string' && numrefresh < 100) {
							console.log("PRE MODS FOR " + prop + ":", valueinvalue)

							if (Array.isArray(valueinvalue) && valueinvalue.length) {
								console.log("PRE ARRAY FOR " + prop + ":", valueinvalue)
								valueinvalue = valueinvalue[0];
								console.log("POST ARRAY FOR " + prop + ":", valueinvalue)
							}

							if ("value" in valueinvalue) {
								console.log("PRE TAKEOUTVALUE FOR " + prop + ":", valueinvalue)
								valueinvalue = valueinvalue.value;
								console.log("POST TAKEOUTVALUE FOR " + prop + ":", valueinvalue)
							}

							console.log("POST MODS FOR " + prop + ":", valueinvalue)
							numrefresh++;
						}
					}
				}

				guild.config.set(prop, value, false);
				data[prop] = value;

				console.log(`New ${prop}`, data[prop]);
			}

			this.client.db.serverconfig.update(data);
			console.log(`${guild.name}'s server postchange`, data)
		});

		console.log("Done");
		if (msg.channel.sendable)
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