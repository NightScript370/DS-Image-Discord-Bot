import MessageListener from '../struct/MessageListener';

export default class MessageDeleteListener extends MessageListener {
	constructor() {
		super('messageDelete', {
			emitter: 'client',
			event: 'messageDelete',
			category: 'guild'
		});
	}

	async exec(message) {
		if (!message.guild) return;
		if (message.partial) return;
		if (message.author.partial) await message.author.fetch();

		this.removePoints(message);
		this.log(message);
	}

	async log(message) {
		if (message.author.id == this.client.user.id && message.content.endsWith("messages deleted!")) return;
		if (message.author.id == this.client.user.id && message.content.endsWith("you may not star bot messages.")) return;
		if (message.author.id == this.client.user.id && message.content.endsWith("you may not star your own message.")) return;

		const logChannel = message.guild.config.render("logchan");
		if (!logChannel) return;
		if (!logChannel.sendable || !logChannel.embedable) return;

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
			} catch(e) {
				console.error(e);
			}
		}

		messageDeleteEmbed
			.addInline(":bookmark_tabs: Channel", `<#${message.channel.id}> (${message.channel.name}) \n#${message.channel.id}`)
			.addInline(":id: Message ID", message.id);

		if (message.attachments.size) {
			try {
				const attachment = extension(message.attachments.first()) ? message.attachments.first().proxyURL : '';
				if(!isEmpty(attachment))
					messageDeleteEmbed
						.attachFiles([attachment])
						.setImage('attachment://'+fileName(attachment));
			} catch (e) {
				console.error(e);
			}
		}

		messageDeleteEmbed
			.setFooter(`${message.author.tag} (#${message.author.id})`, message.author.displayAvatarURL({format: 'png'}))
			.setTimestamp(new Date());

		logChannel.send(title, {embed: messageDeleteEmbed});
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