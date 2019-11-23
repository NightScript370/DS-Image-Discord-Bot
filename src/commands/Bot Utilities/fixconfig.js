import Command from '../../struct/Command';
import { findType, settingProps } from "../../settings/index";

const isObject = (val) => typeof val === 'object' && !(val instanceof Array) && val !== null;

export default class FixConfigCommand extends Command {
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
		let guild;

		for (guild of this.client.guilds) {
			let data = guild.config.data;

			console.log(`${guild.name}'s server prechange`, data)
			for (const prop in data) {
				if (["meta", "$loki", "exec", "guildID"].includes(prop)) continue;

				let value = data[prop];
				console.log(`Old ${prop}`, value, settingProps[prop]);

				if (!value)
					value = findType(prop).nullValue;

				while (isObject(value) && "value" in value) {
					value = value.value;
				}

				let numrefresh = 0;

				if (!settingProps[prop].extendable) {
					while (value instanceof Array && value.length && numrefresh < 100) {
						value = value[0];
						numrefresh++;
					}
				} else {
					if (!(Array.isArray(value)))
						value = [ value ];

					value.forEach(async (valueinvalue, index) => {
						if (index >= value.length) return;
						numrefresh = 0;

						while (typeof value[index] !== 'string' && numrefresh < 100) {
							console.log("PRE MODS FOR " + prop + ":", value[index])

							if (Array.isArray(value[index]) && value[index].length) {
								console.log("PRE ARRAY FOR " + prop + ":", value[index])
								value[index] = value[index][0];
								console.log("POST ARRAY FOR " + prop + ":", value[index])
							}

							if (isObject(value[index]) && "value" in value[index]) {
								console.log("PRE TAKEOUTVALUE FOR " + prop + ":", value[index])
								value[index] = value[index].value;
								console.log("POST TAKEOUTVALUE FOR " + prop + ":", value[index])
							}

							console.log("POST MODS FOR " + prop + ":", value[index])
							numrefresh++;
						}
					});
				}

				guild.config.set(prop, value, false);
				data[prop] = value;

				console.log(`New ${prop}`, data[prop]);
			}

			this.client.db.serverconfig.update(data);
			console.log(`${guild.name}'s server postchange`, data)
		}

		console.log("Done");
		if (msg.channel.sendable)
			msg.util.send("Done.")
	}
};