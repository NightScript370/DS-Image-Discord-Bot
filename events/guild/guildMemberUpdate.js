const { Listener } = require('discord-akairo');

module.exports = class guildMemberUpdateListener extends Listener {
	constructor() {
		super('guildMemberUpdate', {
			emitter: 'client',
			event: 'guildMemberUpdate',
			category: 'guild'
		});
	}

	async exec(oldMember, newMember) {
		if (oldMember.partial) return;
		if (newMember.partial) await newMember.fetch();

		let embed = this.client.util.embed()
			.setColor('#0000FF')
			.setAuthor(newMember.user.username + ' updated', newMember.user.displayAvatarURL({format: 'png'}))
			.setThumbnail(newMember.guild.iconURL({format: 'png'}))
			.setFooter(`${newMember.user.tag} (#${newMember.user.id})`)
			.setTimestamp(new Date());

		if (oldMember.nickname !== newMember.nickname) {
			if (newMember.guild.me.hasPermission('VIEW_AUDIT_LOG')) {
				try {
					const entry = await newMember.guild.fetchAuditLogs({type: 'MEMBER_UPDATE'}).then(audit => audit.entries.first());

					if (entry.target.id == newMember.id && entry.executer.id !== newMember.id) {
						embed.addField('Old Nickname', oldMember.nickname || "None", true)
						embed.addField(`New Nickname (set by ${entry.executer.tag}`, newMember.nickname || "None", true)
					} else {
						embed.addField('Old Nickname', oldMember.nickname || "None", true)
						embed.addField('New Nickname', newMember.nickname || "None", true)
					}
				} catch(e) {
					embed.addField('Old Nickname', oldMember.nickname || "None", true)
					embed.addField('New Nickname', newMember.nickname || "None", true)
				}
			} else {
				embed.addField('Old Nickname', oldMember.nickname || "None", true)
				embed.addField('New Nickname', newMember.nickname || "None", true)
			}
		}

		if (newMember.roles.length !== oldMember.roles.length || !isEmpty(newMember.roles.filter(r => !oldMember.roles.has(r)))) {
			const added = newMember.guild.roles.get(newMember.roles.find(r => !oldMember.roles.has(r)));
			const removed = newMember.guild.roles.get(oldMember.roles.find(r => !newMember.roles.has(r)));

			if (added) embed.addField('Added Role', added)
			if (removed) embed.addField('Removed Role', removed)

			let finalroles = newMember.roles.filter(r => r.id != newMember.guild.id).map(r => r.name).join(", ");
			if (!isEmpty(finalroles))	embed.addField('Final Role Listing', '```'+finalroles+'```')
			else											embed.addField('Final Role Listing', 'None')
		}

		let logchannel = this.client.db.serverconfig.get(this.client, newMember, "logchan")
		if (logchannel && logchannel.sendable && logchannel.embedable)
			logchannel.send({embed});
	}
} 

function isEmpty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}