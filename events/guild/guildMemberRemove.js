const { Listener } = require('discord-akairo');

module.exports = class guildMemberRemoveListener extends Listener {
  constructor() {
    super('guildMemberRemove', {
      emitter: 'client',
      event: 'guildMemberRemove',
      category: 'guild'
    });
  }

  async exec(member) {
    let serverconfig = await this.client.db.serverconfig.findOne({guildID: member.guild.id}) || await this.client.setDefaultSettings(member, this.client);
    if (isEmpty(serverconfig.logchan)) return;

    let memberRemoveLogEmbed = this.client.util.embed()
			.setAuthor(`${member.user.username} has left`, member.user.displayAvatarURL({format: 'png'}))
      .setThumbnail(member.guild.iconURL({format: 'png'}))
			.setDescription(`This server now has ${member.guild.memberCount} members`)
			.setFooter(`${member.user.tag} (#${member.id})`)
			.addField("Joined", member.joinedAt);

    let roles = member.roles.filter(r => r.id != member.guild.id).map(r => r.name).join(", ")
		if(!isEmpty(roles))
			memberRemoveLogEmbed.addField("Roles", "```"+roles+"```");

		const logchannel = await member.guild.channels.get(serverconfig.logchan.value);
    if (logchannel && logchannel.permissionsFor(this.client.user).has('SEND_MESSAGES'))
      logchannel.send({embed: memberRemoveLogEmbed});
	}
}

function isEmpty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}