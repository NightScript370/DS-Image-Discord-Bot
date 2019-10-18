const { Command } = require('discord-akairo');

module.exports = class InviteCommand extends Command {
	constructor() {
		super('invite', {
			aliases: ['invite'],
			category: 'Bot Utilities',
			description: {
				content: 'Sends an invite link to the bot to add to your discord server. Additionally, if embeds are both shown and enabled, it can send you the invite link.'
			}
		});
	}

	async exec(msg) {
		let inviteLink = await this.client.generateInvite();

		let embed = this.client.util.embed()
			.setColor("RED")
			.setDescription(global.lang.getString("If you need help, you can [join our support server]({0})!", this.client.supportServer))

		msg.channel.send("<:Yamamura:633898611125649418> | " + global.lang.getString(msg.author.lang, "Here's a link to invite Yamamura to your server: {0}", inviteLink), (this.client.supportServer && msg.channel.sendable ? {embed} : {}))

		return inviteLink;
	}
};