import discordAkairo from 'discord-akairo';

export default class guildMemberRemoveListener extends discordAkairo.Listener {
    constructor() {
        super('guildMemberRemove', {
            emitter: 'client',
            event: 'guildMemberRemove',
            category: 'guild'
        });
    }

    async exec(member) {
		if (member.guild.partial) await member.guild.fetch();

		let memberRemoveLogEmbed = this.client.util.embed()
			.setThumbnail(member.guild.iconURL({format: 'png'}))
			.setDescription(`This server now has ${member.guild.memberCount} members`)
			.setFooter(`${member.user.tag} (#${member.id})`, member.user.displayAvatarURL({format: 'png'}));

		if (member.joinedAt)
			memberRemoveLogEmbed.addField("Joined", member.joinedAt);

		if (member.roles) {
			let roles = member.roles.filter(role => role.id != member.guild.roles.everyone.id).map(r => r.name).join(", ");
			if(!isEmpty(roles))
				memberRemoveLogEmbed.addField("Roles", "```"+roles+"```");
		}

		let logchannel = await member.guild.config.render("logchan")
		if (logchannel && logchannel.sendable && logchannel.embedable)
			logchannel.send(`${member.user.username} has left`, {embed: memberRemoveLogEmbed});
    }
}

function isEmpty(value) { //Function to check if value is really empty or not
	return (variable && variable !== null && (variable.size || variable.length))
}