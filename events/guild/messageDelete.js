const { Listener } = require('discord-akairo');

module.exports = class MessageDeleteListener extends Listener {
	constructor() {
		super('messageDelete', {
			emitter: 'client',
			event: 'messageDelete',
			category: 'guild'
		});
	}

	async exec(message) {
		const client = await this.client;

		if (!message.guild) return;
		if (message.partial) return;
		if (message.author.id == this.client.user.id && message.content.endsWith("messages deleted!")) return;
		if (message.author.id == this.client.user.id && message.content.endsWith("you may not star bot messages.")) return;
		if (message.author.id == this.client.user.id && message.content.endsWith("you may not star your own message.")) return;

		const logChannel = this.client.db.serverconfig.get(this.client, message, "logchan");

		if (logChannel && logChannel.sendable && logChannel.embedable) {
			let messageDeleteEmbed = this.client.util.embed()
				.setColor("#ff0000")
				.setThumbnail(message.guild.iconURL({format: 'png'}))
				.setDescription(message.content)
				.addField(":bookmark_tabs: Channel", `${message.channel.name} (#${message.channel.id})`)
				.addField(":id: Message ID", message.id)
				.setFooter(`${message.author.tag} (#${message.author.id})`, message.author.displayAvatarURL({format: 'png'}))
				.setTimestamp(new Date());

			const image = message.attachments.size > 0 ? extension(message.attachments.array()[0].url) : '';
			if(!isEmpty(image))	messageDeleteEmbed.setImage(image);

			let title = `:scissors: Message from ${message.author.username} deleted`;
			if (message.guild.me.hasPermission('VIEW_AUDIT_LOG')) {
				try {
					const entry = message.guild.fetchAuditLogs({type: 'MESSAGE_DELETE'}).then(audit => audit.entries.first());

					if (entry.extra && entry.extra.channel.id === message.channel.id
					&& (entry.target.id === message.author.id)
					&& (entry.createdTimestamp > (Date.now() - 5000))
					&& (entry.extra.count >= 1))
						title += ` by ${entry.executor.username}`;
				} catch {}
			}

			logChannel.send(title, {embed: messageDeleteEmbed});
		}
	}
}

function extension(attachment) {
	const imageLink = attachment.split('.');
	const typeOfImage = imageLink[imageLink.length - 1];
	const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
	if (!image) return '';
	return attachment;
}

function isEmpty(value) {
	return (value == null || value.length === 0);
}