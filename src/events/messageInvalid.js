import MessageListener from '../struct/MessageListener';

export default class messageInavlidListener extends MessageListener {
    constructor() {
        super('messageInvalid', {
            emitter: 'commandHandler',
            event: 'messageInvalid'
        });
    }

	async exec(message) {
		if (await this.invalidMessage(message, true)) return;
		if (!message.guild) return;

		let mod = message.guild.members.get(this.client.user.id);
		if (mod.hasPermission(['MANAGE_MESSAGES', 'BAN_MEMBERS'])) {
			if (message.mentions && message.mentions.members) {
				if(message.mentions.members.size > 11) {
					return this.client.moderation.ban(client, message.member, 'Mention spamming in #'+message.channel.name, mod, message);
            	}

				if(message.mentions.members.size > 6) {
					this.client.moderation.warn(client, message.author, 'Mention spamming in #'+message.channel.name, mod, message);
					return message.reply("Do not mass-mention other users.");
				}
			}
		}

		let levelUpCfg = {
			levelUp: true,
			limit: message.guild.config.data.leveluplimit,
			messages: (!message.channel.sendable || !message.guild.config.render('levelup') ? [] : message.guild.config.data.levelupmsgs)
		};

		this.addPoints(message, levelUpCfg)
	}
}