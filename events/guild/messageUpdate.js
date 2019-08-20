const { Listener } = require('discord-akairo');

module.exports = class messageUpdateListener extends Listener {
  constructor() {
    super('messageUpdate', {
      emitter: 'client',
      event: 'messageUpdate',
      category: 'guild'
    });
  }

  exec(oldMessage, newMessage) {
		if (oldMessage.author.bot) return;
		if (!oldMessage.guild) return;

    let logs;

    try {
      logs = this.client.db.serverconfig.get(this.client, newMessage, "logchan")
    } catch(e) {
      console.error(e)
    }

    if (logs && logs.sendable && logs.embedable) {
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
      } else if ((!oldMessage.pinned && newMessage.pinned) && (oldMessage.pinned && !newMessage.pinned)) {
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
}