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
        let memberRemoveLogEmbed = this.client.util.embed()
			.setAuthor(`${member.user.username} has left`, member.user.displayAvatarURL({format: 'png'}))
            .setThumbnail(member.guild.iconURL({format: 'png'}))
			.setDescription(`This server now has ${member.guild.memberCount} members`)
			.setFooter(`${member.user.tag} (#${member.id})`);

        if (!member.partial) {
			memberRemoveLogEmbed.addField("Joined", member.joinedAt);
            try {
                let roles = member.roles.filter(role => role.id != member.guild.roles.everyone.id).map(r => r.name).join(", ");
                if(!isEmpty(roles))
                    memberRemoveLogEmbed.addField("Roles", "```"+roles+"```");
            } catch(e) {
                console.error(e);
            }
        }

		let logchannel = await this.client.db.serverconfig.get(this.client, member, "logchan")
        if (logchannel && logchannel.sendable && logchannel.embedable)
            logchannel.send({embed: memberRemoveLogEmbed});
    }
}

function isEmpty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}