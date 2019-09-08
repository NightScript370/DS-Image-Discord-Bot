const { Listener } = require('discord-akairo');
const { random } = require("including-range-array");

module.exports = class messageUpdateListener extends Listener {
	constructor() {
		super('messageUpdate', {
			emitter: 'client',
			event: 'messageUpdate',
			category: 'guild'
		});
	}

	async exec(oldMessage, newMessage) {
		if (newMessage.partial) newMessage = await newMessage.fetch();
		if (newMessage.author.partial) newMessage.author = await newMessage.author.fetch();
		if (!newMessage.guild) return;

		this.removePoints(newMessage);
		this.log(oldMessage, newMessage);
	}

	async removePoints(message) {
		const inhibitor = require("../../point-inhibit");
		if (inhibitor.inhibite(message)) return;

		let channelmultiplier = this.client.db.multiply.findOne({guild: message.guild.id, channel: message.channel.id}) || this.client.db.multiply.insert({channel: message.channel.id, guild: message.guild.id, multiply: 1 });
		let pointstoadd = random(3) * channelmultiplier.multiply;

		let user = this.client.db.points.findOne({guild: message.guild.id, member: message.author.id});
		if (!user)
			return this.client.db.points.insert({guild: message.guild.id, member: message.author.id, points: pointstoadd, level: 0});

		user.points = user.points - pointstoadd;
		user.level = Math.floor(user.points / 350);

		this.client.db.points.update(user);
	}

	async log(oldMessage, newMessage) {
		if (!oldMessage) return;
		let logs = this.client.db.serverconfig.get(this.client, newMessage, "logchan")

		if (!logs) return;
		if (!logs.sendable || !logs.embedable) return;

		let messageUpdateEmbed = this.client.util.embed()
			.setColor("#0000FF")
			.setThumbnail(newMessage.guild.iconURL({format: 'png'}))
			.setTimestamp(new Date())
			.setFooter(`${newMessage.author.tag} (#${newMessage.author.id})`, newMessage.author.displayAvatarURL({format: 'png'}));

		let text;
		if (oldMessage.content !== newMessage.content) {
			text = `${newMessage.member.displayName} updated their message`;

			if (oldMessage.content.length < 1020 && newMessage.content.length < 1020)
				messageUpdateEmbed
				.addField("Before", `${oldMessage.content}`, true)
				.addField("After", `${newMessage.content}`, true)
		} else if ((!oldMessage.pinned && newMessage.pinned) || (oldMessage.pinned && !newMessage.pinned)) {
			text = `A message by ${newMessage.member.displayName} was pinned`;
			messageUpdateEmbed.setDescription(newMessage.content)
		} else
			return;

		messageUpdateEmbed
			.addField(":bookmark_tabs: Channel", `${newMessage.channel.name} (#${newMessage.channel.id})`)
	  		.addField(":id: Message ID", `${newMessage.id}`)

		logs.send(text, { embed: messageUpdateEmbed });
	}
}