module.exports = async (client, member, reason, moderator, msg=null) => {
	//Setup some backend security. This is just a backup.
	if (!member.guild) return;
	if (!member.guild.me.hasPermission('KICK_MEMBERS')) return;

	let logChannel = member.guild.config.render("logchan");
	let embed = client.util.embed()
		.setColor(0xe00b0b)
		.setThumbnail(member.guild.iconURL())
		.setDescription(reason)
		.setTimestamp(new Date())
		.addInline(":cop: Moderator", `${moderator.user.tag} (#${moderator.id})`)
		.setFooter(`${member.user.tag} (#${member.id})`, member.user.displayAvatarURL());

	if (msg)
		embed.addInline(":bookmark_tabs: Channel", `${msg.channel.name} (#${msg.channel.id})`)

	try {
		member.send(`You were kicked from ${member.guild.name}: ${reason}`);
	} catch(e) {
		if(logChannel)
			embed.addField(":warning: No alert was sent", "Please notify him of his kick manually");
		else
			moderator.send("Couldn't send the kick notification. Please notify him manually").catch();
	}

	member.kick(reason);
	if(logChannel && logChannel.sendable && logChannel.embedable)
		logs.send(`:boot: ${member.user.username} was kicked`, {embed});
}