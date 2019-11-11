export default (client, member, moderator, reason=null, msg=null) => {
	let text;

	if (!member) return "no member";
	if (!member.guild) return "not guild";
	if (!member.guild.me.hasPermission('MANAGE_ROLES')) return "no perms";

	const mutedRole = member.guild.config.render("mutedrole");
	if (!mutedRole) return "role doesn't exist";

	const logChannel = member.guild.config.render("logchan");
	let logEmbed = client.util.embed()
		.setThumbnail(member.guild.iconURL({format: 'png'}))
		.addInline(":cop: Moderator", `${moderator.user.tag} (#${moderator.id})`)
		.setFooter(`${member.user.tag} (#${member.user.id})`, member.user.displayAvatarURL({format: 'png'}))
		.setTimestamp(new Date());
	
	if (msg)
		logEmbed.addInline(":bookmark_tabs: Channel", `${msg.channel.name} (#${msg.channel.id})`)

	if (reason)
		logEmbed.setDescription(reason)

	let hasRole = member.roles.has(mutedRole.id);
	if (hasRole) {
		member.roles.remove(mutedRole, reason);
		text = `${member.displayName}'s mute was removed`;

		try {
			member.send(`You were unmuted from ${member.guild.name}.`);
		} catch(e) {
			if(logChannel)	logEmbed.addField(":warning: No alert was sent", "Please notify him of his removed mute manually");
			else			moderator.send("Couldn't send the unmute notif. Please notify him manually").catch();
		}
	} else {
		member.roles.add(mutedRole, reason);
		text = `:zipper_mouth: ${member.displayName} was muted`;

		try {
			member.send(`You were muted from ${member.guild.name}: ${reason}`);
		} catch(e) {
			if(logChannel)	logEmbed.addField(":warning: No alert was sent", "Please notify him of his removed mute manually")
			else			moderator.send("Couldn't send the unmute notif. Please notify him manually").catch();
		}
	}

	if (logChannel)
		logChannel.send(text, logEmbed);

	return;
}