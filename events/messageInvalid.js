const { Listener } = require('discord-akairo');
const { random } = require("including-range-array");
const levenshtein = require("fast-levenshtein");

module.exports = class messageInavlidListener extends Listener {
    constructor() {
        super('messageInvalid', {
            emitter: 'commandHandler',
            event: 'messageInvalid'
        });
    }

	async exec(message) {
		if (this.invalidMessage(message)) return;

		if (!message.guild) return;
		if (this.antispam(message)) return;

		this.handlePoints(message)
	}

	async invalidMessage(message) {
		if (!message.util.parsed.alias) return false;
		if (!message.channel.sendable) return false;

		const attempt = message.util.parsed.alias;
		if (Array.from(msg.util.handler.aliases.keys()).includes('nop')) return true;

		if (message.util.parsed.prefix !== `<@${this.client.user.id}>` && message.guild) {
			let guildBots = message.guild.members.filter(member => member.user.bot)
			if (guildBots.size) {
				const wait = require('util').promisify(setTimeout);
				await wait(1700);

				let messages = (await message.channel.messages.fetch({ limit: 50 }))
					.filter(channelMessage => channelMessage.author.bot)
					.filter(channelMessage => message.author.id !== this.client.user.id)
					.filter(channelMessage => channelMessage.createdAt >= Date.now() - 1700)

				if (messages.size)
					return true;
			}
		}

		let distances = [];
		let distancebetween;
		let potential;
		for (const alias of message.util.handler.aliases.keys()) {
			distancebetween = levenshtein.get(alias, attempt);
			if (distancebetween > 2) continue;

			distances.push({
				alias: alias,
				command: message.util.handler.modules.find(c => c.aliases.includes(alias)).id,
				distance: distancebetween
			});
		}

		let text = `Hey ${message.guild ? message.member.displayName : message.author.username}, ${attempt} is not a command. \n `;
		let suggestedCmds = [];

		if (distances.length) {
			distances.sort((a, b) => a.dist - b.dist);
			removeDuplicates(distances, 'command');

			let currentcmd;
			let description;

			for (const index in distances) {
				currentcmd = distances[index].command;
				if (!currentcmd) continue;

				description = false;
				if (currentcmd.description) {
					description = currentcmd.description
					if (currentcmd.description.content)
						description = currentcmd.description.content;
				}

				suggestedCmds.push(`\`${parseInt(index)+1}.\` **${distances[index].alias}:** ${description ? (description.join ? description.map(d => __(d)).join(" - ") : __(description)) : ''}`);
			}
		}

		try {
			let invalidCommandMessage = await message.channel.send(text + (suggestedCmds.length ? `However, here are some commands that you might be looking for \n \n${suggestedCmds.join("\n")}\n` : "") + "If you'd like to see more commands, check out the commands command or the page on our website");
			invalidCommandMessage.delete({timeout: suggestedCmds.length ? 12000 : 5000})
		} catch (e) {
			console.error(e);
		}

		return true;
	}

	async handlePoints(message) {
		const inhibitor = require("../point-inhibit");
		if (inhibitor.inhibite(message)) return;

		let channelmultiplier = this.client.db.multiply.findOne({guild: message.guild.id, channel: message.channel.id}) || this.client.db.multiply.insert({channel: message.channel.id, guild: message.guild.id, multiply: 1 });
		let pointstoadd = random(3) * channelmultiplier.multiply;

		let user = this.client.db.points.findOne({guild: message.guild.id, member: message.author.id});
		if (!user)
			return this.client.db.points.insert({guild: message.guild.id, member: message.author.id, points: pointstoadd, level: 0});

		user.points = pointstoadd + user.points;

		let curLevel = Math.floor(user.points / 350);
		let levelUp = user.level < curLevel;

		user.level = curLevel;
		this.client.db.points.update(user);

		if (levelUp) {
			if (!message.channel.sendable) return;

			Array.prototype.random = function() {
				return this[Math.floor(Math.random() * this.length)];
			};

			let levelups = message.guild.levelupmsgs;
			if (!levelups) return console.log(`${server.name} (#${server.id}) does not have level up messages`);
			let levelupmsg = levelups.random()
				.replaceAll("{{server}}", message.guild.name)
				.replaceAll("{{user}}", message.author.username)
				.replaceAll("{{ping}}", `<@${message.author.id}>`)
				.replaceAll("{{level}}", level)

			if (levelupmsg) {
				console.log(`I sent a level up message in ${message.guild.name} (${message.guild.id}) for ${message.author.username} (${message.author.id}): ${parsedLevelUpMessage}`)
				const sentLevelUpMessage = await message.channel.send(parsedLevelUpMessage);
				await sentLevelUpMessage.delete({timeout: 5000});
			}
		}
	}

	antispam(message) {
		var mod = message.guild.members.get(this.client.user.id);
		if (!mod.hasPermission(['MANAGE_MESSAGES', 'BAN_MEMBERS'])) return false;

		// Anti mass mention
		if (message.mentions && message.mentions.members) {
			if(message.mentions.members.size > 11) {
				this.client.moderation.ban(client, message.member, 'Mention spamming in #'+message.channel.name, mod, message);
                return true;
            }

			if(message.mentions.members.size > 6) {
				this.client.moderation.warn(client, message.author, 'Mass mentioning', mod, message);
				message.reply("Do not mass-mention other users.");
                return true;
			}
		}

        return false;
	}
}

function removeDuplicates(originalArray, objKey) {
	var trimmedArray = [];
	var values = [];
	var value;

	for(var i = 0; i < originalArray.length; i++) {
		value = originalArray[i][objKey];

		if(values.indexOf(value) === -1) {
			trimmedArray.push(originalArray[i]);
			values.push(value);
		}
	}

	return trimmedArray;
}