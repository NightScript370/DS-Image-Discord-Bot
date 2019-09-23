const { Command } = require('discord-akairo');
const { findType, settingProps } = require('../../Configuration');

module.exports = class ConfigCommand extends Command {
	constructor() {
		super("config", {
			category: 'Server Management',
			aliases: ["conf", "config"],
			clientPermissions: ['EMBED_LINKS'],
			// userPermissions: ['ADMINISTRATOR'],
			description: {
				content: `View and set the server configuration for the bot.`,
				examples: ['config', "config get prefix", "config set prefix !"],
				usage: 'config ["view"|"get"|"set"|"clear"] (key) (value)',
			},
			args: [
				{
					id: 'action',
					description: "The action you would like to perform. If you do not specify this or it's invalid, you will view the configuration instead",
					default: "view",
					type: [["view", ""], ["get"], ["set"], ["clear"]]
				},
				{
					id: 'key',
					description: "This will be the key you would like to modify.",
					default: null,
					type: 'string'
				},
				{
					id: 'value',
					description: "This will be the value of the key you set before.",
					default: null,
					match: "rest"
				}
			]
		});
	}

	userPermissions(msg) {
		return (this.client.isOwner(msg.author.id) || msg.member.hasPermission("ADMINISTRATOR")) ? null : "ADMINISTRATOR";
	}

	getTitles(__) {
		return {
			logchan: __("Log channel"),
			welcomechan: __("Welcome channel"),
			welcomemessage: __("Welcome messages"),
			leavemessage: __("Leave message"),
			prefix: __("Prefix"),
			makerboard: __("MakerBoard URL"),
			starboardchannel: __("Starboard channel"),
			levelup: __("Level UP"),
			levelupmsgs: __("Level UP messages"),
			mutedrole: __("Muted role"),
		}
	}

	async exec(msg, { action, key, value }) {
		const __ = (k, ...v) => global.getString(msg.author.lang, k, ...v);
		let data = msg.guild.config.data;

		switch (action) {
			case 'view':
				let titles = this.getTitles(__);
				let embed = this.client.util.embed()
					.setTitle(__("Server configuration for {0}", msg.guild.name))
					.setDescription(__("You can use `{0}config set <key> null` to set a value to an empty state.", this.handler.prefix(msg)))
					.setYamamuraCredits(true);

				for (let k in data) {
					if (["meta", "$loki", "guildID"].includes(k)) continue;

					let v = data[k];
					let type = findType(k);
					console.log(k, v, (type ? type.id : type))

					let embedValue;

					try {
						let deserializedValue = type.render(this.client, msg, v);
						if (deserializedValue == type.nullValue
						 || deserializedValue == undefined
						 || (deserializedValue == [] || deserializedValue[0] == undefined))
							embedValue = __("This value is empty");
						else
							embedValue = deserializedValue;
					} catch (e) {
						embedValue = "This field has an error";
					}

					embed.addField(titles[k] + " [`" + k + "`]", embedValue)
				}

				return msg.util.send(embed);
				break;
			case 'get':
				if (!key) return msg.util.send(__("You didn't specify a key!"));

				let type = findType(settingsProps[key]);
				let deserializedValue = type.render(this.client, msg, data[key]);

				return msg.util.send(deserializedValue == type.nullValue || deserializedValue == undefined || (deserializedValue == [] || deserializedValue[0] == undefined) ? __("This value is empty") : deserializedValue)
				break;
			case 'set':
				if (!key) return msg.util.send(__("You didn't specify a key!"));
				if (!settingProps[key]) return msg.util.send(__("The key `{0}` does not exist.", key));
				if (settingProps[key].endsWith(":ex")) return await this.setArray(msg, data, key, value);

				if (!value) return msg.util.send(__("You didn't specify a value!"));
				let t = findType(key);

				if (!t) return msg.util.send(__("An error occurred: {0}.\nAlert the bot owners to let them fix this error", __("There's no type with ID `{0}`", data[key].type)));
				if (!t.validate(this.client, msg, value)) return msg.util.send(__("The input `{0}` is not valid for the type `{1}`.", value, t.id));

				if (value != "null") {
					let newValue = t.serialize(this.client, msg, value);
					data[key] = newValue;
				} else
					data[key] = t.nullValue;

				return msg.util.send(require("util").inspect(data[key]), {code: 'js'});
				break;
			case 'clear':
			case 'reset':
				let resp = await this.awaitReply(msg, __("Are you ___**100%**___ sure you want to reset the configuration? [Y/N]"), 30000);

				if (resp && typeof resp == 'string' && resp.toLowerCase() == "y") {
					console.log(msg.author.tag + " accepted to clear " + msg.guild.name + "'s settings")
					try {
						await msg.guild.config.setDefaultSettings(false, false);
						return msg.util.reply(__("I have successfully cleared the configuration"));
					} catch (e) {
						console.error(e);
						console.log(msg.guild.config.data)
						return msg.util.send(__("There has been an error while clearing the configuration. Please report this bug to the {0} Developers", this.client.user.username));
					}
				}
				return msg.util.reply(__("action cancelled"));
				break;
			default:
				return msg.util.send(__("The action must be one of [{0}]!", "view, get, set, clear"));
				break;
		}
	}

	async setArray(msg, data, key, value, recursionDepth = 0) {
		const __ = (k, ...v) => global.getString(msg.author.lang, k, ...v);
		let t = findType(key);

		let action = await this.awaitReply(msg, __("What do you want to do with the values? [`add` a value/`clear` the values]"), 30000);
		action = action.toLowerCase();

		if (!action) {
			return msg.util.reply(__("action cancelled"));
		} else if (action == "clear") {
			let resp = await this.awaitReply(msg, __("Are you ___**100%**___ sure you want to reset the array? [Y/N]"), 30000);

			if (resp && typeof resp == "string" && resp.toLowerCase() == "y") {
				try {
					data[key] = [];

					return msg.util.reply(__("I have successfully cleared the array"));
				} catch (e) {
					console.error(e);
					return msg.util.send(__("There has been an error while clearing the array. Please report this bug to the {0} Developers", this.client.user.username));
				}
			}
			return msg.util.reply(__("action cancelled"));
		} else if (action == "add") {
			let resp = ""
			let arr = [];
			while (typeof resp == "string" && resp.toLowerCase() != "stop") {
				if (resp) {
					let actualValue = findType(nonextendedType).serialize(this.client, msg, resp);
					arr.push(actualValue);
				}
				resp = await this.awaitReply(msg, __("Enter the value you want to add, or type `stop` (or wait 30 seconds) to stop"), 30000);
			}

			// console.log(arr);
			data[key] = arr.concat(data[key]);

			// await this.client.db.serverconfig.update(data);
			msg.util.send(require("util").inspect(data[key]), {code: 'js'});
		} else {
			msg.util.send(__("The action must be one of [{0}]!", "add, clear"));
		}

		if (recursionDepth < 5) {
			let naction = await this.awaitReply(msg, __("Do something else? [`y`/`n`]"), 30000);
			naction = naction.toLowerCase();

			if (!!naction && naction == "y") {
				return this.setArray(msg, data, key, value, ++recursionDepth);
			} else {
				return msg.util.reply(__("action cancelled"));
			}
		}
	}

	async awaitReply(msg, question, limit = 60000) {
		const filter = m=>(m.author.id == msg.author.id);
		await msg.channel.send(question);
		try {
			const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
			return collected.first().content;
		} catch (e) {
			return false;
		}
	};
};
