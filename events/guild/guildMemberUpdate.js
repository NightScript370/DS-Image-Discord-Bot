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
		if (newMember.partial) newMember = await newMember.fetch();

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

		if (newMember.roles.size !== oldMember.roles.size) {
			let changedRoles = [];

	        let oldRoles = oldMember.roles.array();
    	    let newRoles = newMember.roles.array();

        	if (oldRoles.length > newRoles.length) {
        		for (var role of oldMember.roles) {
					if (!newMember.roles.has(role.id)) continue;
					changedRoles.push(`${role.name} (#${role.id})`);
				}

				embed.addInline('Removed Roles', changedRoles.join("\n"));
        	} else {
				for (var role of newMember.roles) {
					if (!oldMember.roles.has(role.id)) continue;
					changedRoles.push(`${role.name} (#${role.id})`);
				}

				embed.addInline('Added Roles', changedRoles.join("\n"))
        	}

			const roles = (newMember.roles ? newMember.roles
				.filter(role => role.id !== newMember.guild.roles.everyone.id)
			    .sort((a, b) => b.position - a.position)
			    .map(role => role.name) : []);

			embed.addField(`Final Role Listing (${roles.length})`, roles.length ? this.trimArray(roles).join(', ') : 'None')
		}

		let logchannel = this.client.db.serverconfig.get(this.client, newMember, "logchan")
		if (logchannel && logchannel.sendable && logchannel.embedable)
			logchannel.send({embed});
	}

	trimArray(arr) {
		if (arr.length > 10) {
			const len = arr.length - 10;
			arr = arr.slice(0, 10);
		}
		return arr;
	}
} 

function isEmpty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}