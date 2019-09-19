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
		this.client.guilds.forEach(async guild => {
			let data = guild.config.data;

			console.log(`${guild.name}'s server prechange`, data)
			for (const prop in data) {
				if (["meta", "$loki", "exec", "guildID"].includes(prop)) continue;

				const value = data[prop];
				console.log(prop, value, settingProps[prop]);

				if (!value)
					value = findType(prop).nullValue;

				while (isObject(value)) {
					value = value.value
				}

				if (!settingProps[prop].endsWith(':ex')) {
					while (value instanceof Array) {
						break; // Do this for now until we have actual code that can undo an array into string
					}
				} else {
					for (var valueinvalue of value) {
						while (valueinvalue instanceof Array) {
							break;
						}

						while (isObject(valueinvalue)) {
							valueinvalue = valueinvalue.value
						}
					}
				}

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