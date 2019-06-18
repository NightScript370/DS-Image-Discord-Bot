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
    if (!oldMessage.content || !newMessage.content) return;
    if (oldMessage.content == newMessage.content) return;
		if (oldMessage.content.length < 1 || oldMessage.content.length > 1000 || newMessage.content.length < 1 || newMessage.content.length > 1000) return;
		if (oldMessage.author.bot) return;
		if (!oldMessage.guild) return;

    try {
      const logs = this.client.db.serverconfig.get(this.client, newMessage, "logchan")
          
      if (logs) {
  		  let messageUpdateEmbed = this.client.util.embed()
	  		  .setColor("#0000FF")
	  		  .setAuthor(`${newMessage.author.username} updated their message`, newMessage.author.displayAvatarURL({format: 'png'}))
	  		  .setThumbnail(newMessage.guild.iconURL({format: 'png'}))
	  		  .addField("Before", `${oldMessage.content}`, true)
	  		  .addField("After", `${newMessage.content}`, true)
	  		  .addField(":bookmark_tabs: Channel", `${newMessage.channel.name} (#${newMessage.channel.id})`)
	  		  .addField(":id: Message ID", `${newMessage.id}`)
	  		  .setTimestamp(new Date())
	  		  .setFooter(`${newMessage.author.tag} (#${newMessage.author.id})`);

	  	  logs.send({ embed: messageUpdateEmbed });
      }
    } catch(e) {
      console.error(e)
    }
  }
}