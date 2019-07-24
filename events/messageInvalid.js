const { Listener } = require('discord-akairo');
const { random } = require("including-range-array");
const { getKey, findType } = require('../Configuration');
const levenshtein = require("fast-levenshtein");

module.exports = class messageListener extends Listener {
    constructor() {
        super('messageInvalid', {
            emitter: 'commandHandler',
            event: 'messageInvalid'
        });
    }

	async exec(message) {
        if (message.util.parsed.alias && message.channel.sendable) {
            const distances = [];
            const attempt = message.util.parsed.alias;
            if (!!message.util.handler.modules.filter(c => c.aliases.includes(attempt)).size) return;

            let categories = Array.from(this.client.commandHandler.categories.entries());
            let catNames = categories.map(arr => arr[0]);
            let cats = categories.map(arr => arr[1]).sort((c1, c2) => c1.id.localeCompare(c2.id));

            let cmds = cats.map(cat => Array.from(cat.entries()).map(c => c[1])).flat();

            let distancebetween;
            for (const alias of message.util.handler.aliases.keys()) {
                distancebetween = levenshtein.get(alias, attempt);
                if (distancebetween > 2) continue;

                let cmd = message.util.handler.modules.filter(c => c.aliases.includes(alias))[0]
                let newDist = {
                    dist: distancebetween,
                    alias,
                };

                if (cmd) newDist.cmd = cmd;

                distances.push(newDist);
            }

            if (distances.length == 0) return message.reply(`this command cannot be found. Please check the command list found on our website for a list of commands: https://yamamura-bot.tk/commands`);
            distances.sort((a, b) => a.dist - b.dist);

            let text = `:warning: **__${attempt} is not a command.__** \n `;

            let currentcmd;
            let description;

            let suggestedCmds = [];

            for (const index in distances) {
                var analyzedcmd = distances[index].cmd;
                if (!analyzedcmd) continue;

                // if (currentcmd && currentcmd.id == message.util.handler.aliases.get(distances[index].alias)) continue;
                currentcmd = analyzedcmd;

                if (currentcmd.description) {
                    description = currentcmd.description;
                    if (currentcmd.description.content)
                        description = currentcmd.description.content;

                    if (description.join)
                        description = description.join("-");
                }
                suggestedCmds.push(`\`${parseInt(index)+1}.\` **${distances[index].alias}** ${description ? `- ${description}` : ''}`);
            }

            return message.channel.send(text + suggestedCmds.length ? `However, here are some commands that you might be looking for \n \n${suggestedCmds.join("\n")}` : "").catch((err) => console.log(err));
	    }

        if (!message.guild) return;
        if (this.antispam(message)) return;

		const inhibitor = require("../point-inhibit");
		if (inhibitor.inhibite(message)) return;

        let channelmultiplier = this.client.db.multiply.findOne({guild: message.guild.id, channel: message.channel.id}) || this.client.db.multiply.insert({channel: message.channel.id, guild: message.guild.id, multiply: 1 });
		let pointstoadd = random(3) * channelmultiplier.multiply;

        let user = this.client.db.points.findOne({guild: message.guild.id, member: message.author.id});
        if (user) {
            user.points = pointstoadd + user.points;

            let curLevel = Math.floor(user.points / 350);
            if (user.level < curLevel) {
				this.sendLevelUpMessage(message, curLevel)
			}
            user.level = curLevel;

            this.client.db.points.update(user);
        } else {
            this.client.db.points.insert({guild: message.guild.id, member: message.author.id, points: pointstoadd, level: 0})
        }
	}

    async sendLevelUpMessage(message, level) {
        Array.prototype.random = function() {
            return this[Math.floor(Math.random() * this.length)];
        };

        try {
            const server = message.guild;
            if (!message.channel.sendable) return;
            if (!server.levelupmsgs) return console.log("This server does not have level up messages");

            let rawLevelUpMessage = this.client.db.serverconfig.get(this.client, message, "levelupmsgs").random()
            let parsedLevelUpMessage = rawLevelUpMessage;

            let coinEmote = this.client.emojis.get("549336322146566175");

            parsedLevelUpMessage = parsedLevelUpMessage
                .replaceAll("{{guild}}", message.guild.name).replaceAll("{{server}}", message.guild.name)
                .replaceAll("{{user}}", message.author.username).replaceAll("{{member}}", message.author.username).replaceAll("{{username}}", message.author.username).replaceAll("{{membername}}", message.author.username)
                .replaceAll("{{memberping}}", `<@${message.author.id}>`).replaceAll("{{userping}}", `<@${message.author.id}>`)
                .replaceAll("{{level}}", level)
                .replaceAll("{{coin}}", coinEmote)

            if (parsedLevelUpMessage) {
                console.log(`I sent a level up message in ${message.guild.name} (${message.guild.id}) for ${message.author.username} (${message.author.id}): ${parsedLevelUpMessage}`)
                const sentLevelUpMessage = await message.channel.send(parsedLevelUpMessage);
                await sentLevelUpMessage.delete({timeout: 5000});
            }
        } catch(e) {
            console.log(e)
        }
    }

	antispam(message) {
		var mod = message.guild.members.get(this.client.user.id);
		if (!mod.hasPermission(['MANAGE_MESSAGES', 'BAN_MEMBERS'])) return;

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
