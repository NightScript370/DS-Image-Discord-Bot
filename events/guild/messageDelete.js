const { Listener } = require('discord-akairo');

module.exports = class MessageDeleteListener extends Listener {
  constructor() {
      super('messageDelete', {
          emitter: 'client',
          event: 'messageDelete',
          category: 'guild'
      });
  }
  
  log() {
    this.i = 0;
    //console.log(this.i++);
  }

  async exec(message) {
    const client = await this.client;

    if (!message.guild) return;
    if (message.partial) return;
    if (message.author.id == this.client.user.id && message.content.endsWith("messages deleted!")) return;
		if (message.author.id == this.client.user.id && message.content.endsWith("you may not star bot messages.")) return;
		if (message.author.id == this.client.user.id && message.content.endsWith("you may not star your own message.")) return;

    try {
      const logs = this.client.db.serverconfig.get(this.client, message, "logchan");

      if (logs) {
        this.log();
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

        this.log();

        if (message.guild.me.hasPermission('VIEW_AUDIT_LOG')) {
          try {
            this.log();
            const entry = message.guild.fetchAuditLogs({type: 'MESSAGE_DELETE'}).then(audit => audit.entries.first());

            this.log();

            if (entry.extra && entry.extra.channel.id === message.channel.id
            && (entry.target.id === message.author.id)
            && (entry.createdTimestamp > (Date.now() - 5000))
            && (entry.extra.count >= 1))
              messageDeleteEmbed.setTitle(`:scissors: Message from ${message.author.username} deleted by ${entry.executor.username}`);
            else
              messageDeleteEmbed.setTitle(`:scissors: Message from ${message.author.username} deleted`);
          } catch (e) {
            messageDeleteEmbed.setTitle(`:scissors: Message from ${message.author.username} deleted`);
          }
          this.log();
        } else {
          messageDeleteEmbed.setTitle(`:scissors: Message from ${message.author.username} deleted`);
          this.log();
        }

        logs.send({embed: messageDeleteEmbed});
      }
    } catch (e) {
      //console.error(e);
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