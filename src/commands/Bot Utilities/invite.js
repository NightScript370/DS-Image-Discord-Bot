import discordAkairo from 'discord-akairo';

export default class InviteCommand extends discordAkairo.Command {
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
		
		let attachment = {};
		if (this.client.supportServer && msg.channel.embedable)
			attachment.embed = this.client.util.embed()
				.setColor("RED")
				.setDescription(global.translate(msg.author.lang, "If you need help, you can [join our support server]({0})!", this.client.supportServer))

		msg.channel.send("<:Yamamura:633898611125649418> | " + global.translate(msg.author.lang, "Here's a link to invite Yamamura to your server: {0}", inviteLink), attachment)

		return inviteLink;
	}
};