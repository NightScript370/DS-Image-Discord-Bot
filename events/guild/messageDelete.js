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
		if (message.author.partial) await message.author.fetch();
		if (message.author.id == this.client.user.id && message.content.endsWith("messages deleted!")) return;
		if (message.author.id == this.client.user.id && message.content.endsWith("you may not star bot messages.")) return;
		if (message.author.id == this.client.user.id && message.content.endsWith("you may not star your own message.")) return;

		const logChannel = this.client.db.serverconfig.get(this.client, message, "logchan");

		if (logChannel && logChannel.sendable && logChannel.embedable) {
			let title = `:scissors: Message from ${message.author.username} deleted`;
			let messageDeleteEmbed = this.client.util.embed()
				.setColor("#ff0000")
				.setThumbnail(message.guild.iconURL({format: 'png'}))
				.setDescription(message.content);

			if (message.guild.me.hasPermission('VIEW_AUDIT_LOG')) {
				try {
					const entry = await message.guild.fetchAuditLogs({type: 'MESSAGE_DELETE', limit: 1}).then(audit => audit.entries.first());
					if (entry) {
						const executor = entry.executor;
						if (!executor || executor.partial) await executor.fetch();

						if (entry.extra && entry.extra.channel.id === message.channel.id
						&& (entry.target.id === message.author.id)
						&& (entry.createdTimestamp > (Date.now() - 5000))
						&& (entry.extra.count >= 1))
							messageDeleteEmbed.addField(':cop: Moderator', executor.username + (entry.reason ? ` - ${entry.reason}` : ''))
					}
				} catch {}
			}

			messageDeleteEmbed
				.addInline(":bookmark_tabs: Channel", `${message.channel.name} (#${message.channel.id})`)
				.addInline(":id: Message ID", message.id);

			const attachment = message.attachments.size > 0 && extention(message.attachments.first()) ? message.attachments.first().proxyURL : '';
			if(!isEmpty(attachment))
				messageDeleteEmbed
					.attachFiles([attachment])
					.setImage(fileName(attachment));

			messageDeleteEmbed
				.setFooter(`${message.author.tag} (#${message.author.id})`, message.author.displayAvatarURL({format: 'png'}))
				.setTimestamp(new Date());

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

function fileName(attachment) {
	const split = attachment.split('/');
	return split[split.length - 1];
}

function isEmpty(value) {
	return (value == null || value.length === 0);
}