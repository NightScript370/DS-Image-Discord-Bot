let settingProps = {
	logchan: "channel",
	welcomechan: "channel",
	welcomemessage: "string:ex",
	leavemessage: "string:ex",
	prefix: "string",
	makerboard: "string",
	starboardchannel: "channel:ex",
	levelup: "bool",
	levelupmsgs: "string:ex",
	mutedrole: "role:ex"
}

let types = [
	class IntType {
		constructor() {
			this.id = "int"
		}

		static get nullValue() {
			return null;
		}

		static get id() {
			return "int";
		}

		static serialize(client, _, val) {
			return "" + val;
		}

		static deserialize(client, _, val) {
			return parseInt(val);
		}
		
		static render(client, _, val) {
			return parseInt(val);
		}

		static validate(client, _, val) {
			return !isNaN(val);
		}
	},
	
	class BoolType {
		constructor() {
			this.id = "bool"
		}

		static get nullValue() {
			return null;
		}

		static get id() {
			return "bool";
		}

		static serialize(client, _, val) {
			return "" + val;
		}

		static deserialize(client, _, val) {
			return val == "false" ? false : true;
		}

		static render(client, msg, val) {
			return getString(msg.author.lang, val.toString() == "true" ? "Enabled" : "Disabled");
		}

		static validate(client, _, val) {
			return ["true", "false"].includes(val.toLowerCase());
		}
	},

	class StringType {
		constructor() {
			this.id = "string"
		}

		static get nullValue() {
			return "";
		}

		static get id() {
			return "string";
		}

		static serialize(client, _, values) {
			if (!values) return "";

			if (Array.isArray(values)) {
				let array = [];

				for (var value of values) {
					array.push("" + value);
				}

				return value;
			}

			return "" + values;
		}

		static deserialize(client, _, values) {
			if (!values) return "";

			if (Array.isArray(values)) {
				let array = [];

				for (var value of values) {
					array.push("" + value);
				}

				return value;
			}

			return "" + values;
		}

		static render(client, _, values) {
			if (!values) return "";

			if (Array.isArray(values)) {
				let array = [];

				for (var value of values) {
					array.push("" + value);
				}

				return value;
			}

			return "" + values;
		}

		static validate(client, _, values) {
			if (!values) return false;

			if (Array.isArray(values)) {
				for (var value of values) {
					if (typeof value !== "string")
						return false;
				}

				return true;
			}

			return typeof values == "string";
		}
	},

	class CommandType {
		constructor() {
			this.id = "command"
		}

		static get nullValue() {
			return "";
		}

		static get id() {
			return "command";
		}

		static serialize(client, _, val) {
			let cmd = client.commandHandler.aliases.get(val);
			if (cmd)
				return cmd.id;

			return this.nullValue;
		}

		static deserialize(client, _, values) {
			if (!values) return this.nullValue;

			if (Array.isArray(values)) {
				let array = [];

				for (var value of values) {
					array.push(client.commandHandler.modules.get(value));
				}

				return array;
			}

			return client.commandHandler.modules.get(values);
		}

		static render(client, _, values) {
			let command;
			if (!values) return this.nullValue;

			if (Array.isArray(values)) {
				let array = [];

				for (var value of values) {
					command = this.deserialize(client, _, value);

					if (!command) continue;
					array.push(command.id);
				}

				return array;
			}

			command = this.deserialize(client, _, values);
			return command ? command.id : this.nullValue;
		}

		static validate(client, _, val) {
			let commands = Array.from(client.commandHandler.modules.keys());
			if (commands.filter(command => command === val).length)
				return true;

			return false;
		}
	},

	class ChannelType {
		constructor() {
			this.id = "channel"
		}

		static get nullValue() {
			return null;
		}

		static get id() {
			return "channel";
		}

		static serialize(client, msg, val) {
			const matches = val.match(/(?:<#)?(\d{17,19})>?/);
			if (matches)
				return matches[1];

			let name = msg.guild.channels.find(c => {
				// console.log(require("util").inspect(c, {depth: 0}), c.name, c.type);
				return c.name ? c.name.toLowerCase() : "" == val.toLowerCase() && c.type == "text";
			});
			if (name) return name.id;

			return this.nullValue;
		}
		
		static deserialize(client, msg, val) {
			return val ? msg.guild.channels.get(val) : this.nullValue;
		}

		static render(client, msg, val) {
			let chan = this.deserialize(client, msg, val);
			return chan ? `<#${chan.id}>` : this.nullValue;
		}

		static validate(client, msg, val) {
			let channelIDregex = /(?:<#)?(\d{17,19})>?/;
			if (channelIDregex.test(val)) {
				let channelID = val.match(channelIDregex)[1];
				if (msg.guild.channels.has(channelID))
					return true;
			}

			let isName = msg.guild.channels.find(c => c.name ? c.name.toLowerCase() : "" == val.toLowerCase() && c.type == "text");
			if (isName)
				return true;

			return false;
		}
	},

	class RoleType {
		constructor() {
			this.id = "role"
		}

		static get nullValue() {
			return null;
		}

		static get id() {
			return "role";
		}

		static serialize(client, msg, val) {
			const matches = val.match(/(?:<@&)?(\d{17,19})>?/);
			if (matches)
				return matches[1];

			let name = msg.guild.roles.filter(r => r.id != r.guild.id).find(c => {
				// console.log(require("util").inspect(c, {depth: 0}), c.name, c.type);
				return c.name.toLowerCase() == val.toLowerCase();
			});
			if (name) return name.id;

			return this.nullValue;
		}
		
		static deserialize(client, msg, val) {
			return val ? msg.guild.roles.get(val) : this.nullValue;
		}

		static render(client, msg, val) {
			let chan = this.deserialize(client, msg, val);
			return chan ? `<@&${chan.id}>` : this.nullValue;
		}

		static validate(client, msg, val) {
			try {
				let isID = /(?:<@&)?(\d{17,19})>?/.test(val);
				let isName = !!msg.guild.roles.filter(r => r.id != r.guild.id).find(c => c.name.toLowerCase() == val.toLowerCase());
				return isName || isID;
			} catch (e) {
				console.error(e);
				return false;
			}
		}
	}
];

function findType(key) {
	return types.filter(type => type.id == settingProps[key].replace(":ex", ''))[0];
}

function getKey(client, msg, key) {
	let data = client.db.serverconfig.findOne({guildID: msg.guild.id});

	let value = data[key];
	return findType(key).deserialize(client, msg, value);
}

module.exports = {
	types, findType, getKey, settingProps
};