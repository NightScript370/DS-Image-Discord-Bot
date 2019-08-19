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

    const logs = this.client.db.serverconfig.get(this.client, newMessage, "logchan")
      .catch(console.error)

    if (logs && logs.sendable && logs.embedable) {
  	  let messageUpdateEmbed = this.client.util.embed()
  		  .setColor("#0000FF")
	  	  .setThumbnail(newMessage.guild.iconURL({format: 'png'}))
	  	  .addField("Before", `${oldMessage.content}`, true)
			  .addField("After", `${newMessage.content}`, true)
	  	  .setTimestamp(new Date())
	  	  .setFooter(`${newMessage.author.tag} (#${newMessage.author.id})`, newMessage.author.displayAvatarURL({format: 'png'}));

      let text
      if (oldMessage.content !== newMessage.content) {
        text = `${newMessage.author.username} updated their message`;
      }
      messageUpdateEmbed
        .addField(":bookmark_tabs: Channel", `${newMessage.channel.name} (#${newMessage.channel.id})`)
	  		.addField(":id: Message ID", `${newMessage.id}`)

		  logs.send(text, { embed: messageUpdateEmbed });
    }
  }
}