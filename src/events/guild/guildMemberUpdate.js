const Listener = require('discord-akairo')

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
			if (newMember.nickname == newMember.guild.memberCount && oldMember.nickname == oldMember.guild.memberCount)
				return;

			embed.addInline('Old Nickname', oldMember.nickname || "None");
			let executer;

			if (newMember.guild.me.hasPermission('VIEW_AUDIT_LOG')) {
				const entry = await newMember.guild.fetchAuditLogs({type: 'MEMBER_UPDATE'}).then(audit => audit.entries.first());
				if (entry.executer) {
					if (entry.executer.partial) await entry.executer.fetch();

					if (entry.target.id == newMember.id && entry.executer.id !== newMember.id)
						executer = entry.executer.tag;
				}
			}

			embed.addInline(`New Nickname ${executer ? `(set by ${executer})` : ''}`, newMember.nickname || "None")
		}

		if (newMember.roles.size !== oldMember.roles.size) {
			let changedRoles = [];

	        let oldRoles = oldMember.roles.array();
    	    let newRoles = newMember.roles.array();

        	if (oldRoles.length > newRoles.length) {
        		for (var role of oldMember.roles.values()) {
					if (newMember.roles.has(role.id)) continue;
					changedRoles.push(`${role.name} (#${role.id})`);
				}

				if (changedRoles.length)
					embed.addInline('Removed Roles', changedRoles.join("\n"));
        	} else {
				for (var role of newMember.roles.values()) {
					if (oldMember.roles.has(role.id)) continue;
					changedRoles.push(`${role.name} (#${role.id})`);
				}

				if (changedRoles.length)
					embed.addInline('Added Roles', changedRoles.join("\n"))
        	}

			const roles = (newMember.roles ? newMember.roles
				.filter(role => role.id !== newMember.guild.roles.everyone.id)
			    .sort((a, b) => b.position - a.position)
			    .map(role => role.name) : []);

			embed.addField(`Final Role Listing (${roles.length})`, roles.length ? this.trimArray(roles).join(', ') : 'None')
		}

		let logchannel = newMember.guild.config.render("logchan")
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