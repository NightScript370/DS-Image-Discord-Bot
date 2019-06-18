const { Listener } = require('discord-akairo');
const { random } = require("including-range-array");
const { getKey, findType } = require('../../Configuration');

module.exports = class messageListener extends Listener {
    constructor() {
        super('messageInvalid', {
            emitter: 'commandHandler',
            event: 'messageInvalid',
            category: 'guild'
        });
    }

	async exec(message) {
        if (!message.guild) return;
        if (this.antispam(message)) return;

		const inhibitor = require("../../point-inhibit");
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