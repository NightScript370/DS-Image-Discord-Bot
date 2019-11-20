import Listener from 'discord-akairo';
import { random } from "including-range-array";
import { get as getDistance } from "fast-levenshtein";
import { inhibit as pointInhibit } from "../point-inhibit"

export default class messageInavlidListener extends Listener {
    constructor() {
        super('messageInvalid', {
            emitter: 'commandHandler',
            event: 'messageInvalid'
        });
    }

	async exec(message) {
		if (this.invalidMessage(message) == true) return;

		if (!message.guild) return;
		if (this.antispam(message) == true) return;

		this.handlePoints(message)
	}

	async invalidMessage(message) {
		if (!Object.keys(message.util.parsed).length)
			return false;

		const attempt = message.util.parsed.alias;

		if (!attempt)
			return false;

		if (Array.from(message.util.handler.aliases.keys()).includes(attempt))
			return true;

		if (!message.channel.sendable) return false;
		if (message.util.parsed.prefix !== `<@${this.client.user.id}>` && message.guild) {
			let guildBots = message.guild.members.filter(member => member.user.bot);
			guildBots.delete(this.client.user.id);
			if (guildBots.size) {
				const wait = require('util').promisify(setTimeout);
				await wait(1700);

				let messages = (await message.channel.messages.fetch({ limit: 50 }))
					.filter(channelMessage => channelMessage.author.bot)
					.filter(channelMessage => channelMessage.author.id !== this.client.user.id)
					.filter(channelMessage => channelMessage.createdAt >= message.createdAt)

				if (messages.size)
					return true;
			}
		}

		let distances = [];
		let distancebetween;
		for (const alias of message.util.handler.aliases.keys()) {
			distancebetween = getDistance(alias, attempt);
			if (distancebetween > 2) continue;

			distances.push({
				alias: alias,
				command: message.util.handler.modules.find(c => c.aliases.includes(alias)),
				distance: distancebetween
			});
		}

		const __ = (k, ...v) => global.translate(message.author.lang, k, ...v);

		let text = __("Hey {0}, {1} is not a command.", message.guild ? message.member.displayName : message.author.username, attempt) + "\n";
		let suggestedCmds = [];
		let iterated = [];

		if (distances.length) {
			distances.sort((a, b) => a.dist - b.dist);

			let currentcmd;
			let description;

			for (const index in distances) {
				currentcmd = distances[index].command;
				if (!currentcmd) continue;
				if (iterated.includes(currentcmd.id)) continue;

				description = false;
				if (currentcmd.description) {
					description = currentcmd.description
					if (currentcmd.description.content)
						description = currentcmd.description.content;
				}

				suggestedCmds.push(`\`${parseInt(index)+1}.\` **${distances[index].alias} ${description ? ':** ' + (description.join ? description.map(d => __(d)).join(" - ") : __(description)) : '**'}`);
				iterated.push(currentcmd.id);
			}
		}

		if (suggestedCmds.length)
			text = text
				 + __("However, here are some commands that you might be looking for:")
				 + "\n\n"
				 + suggestedCmds.join("\n")
				 + "\n\n"

		text += __("If you'd like to see more commands, check out the commands command or the page on our website");

		try {
			let invalidCommandMessage = await message.channel.send(text);
			invalidCommandMessage.delete({timeout: (suggestedCmds.length ? 12000 : 5000)})
		} catch (e) {
			console.error(e);
		}

		return true;
	}

	async handlePoints(message) {
		if (pointInhibit(message)) return;

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
			if (!message.channel.sendable || !message.guild.config.render('levelup')) return;

			let levelups = message.guild.config.data.levelupmsgs;
			if (!levelups) return console.log(`${server.name} (#${server.id}) does not have level up messages`);
			let levelupmsg = levelups.random()
				.replaceAll("{{server}}", message.guild.name)
				.replaceAll("{{user}}", message.author.username)
				.replaceAll("{{ping}}", `<@${message.author.id}>`)
				.replaceAll("{{level}}", curLevel)

			if (levelupmsg) {
				console.log(`I sent a level up message in ${message.guild.name} (${message.guild.id}) for ${message.author.username} (${message.author.id}): ${levelupmsg}`)
				const sentLevelUpMessage = await message.channel.send(levelupmsg);
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