module.exports = (client, member, reason, moderator, msg) => {
	member.warn(reason, moderator);

	const logs = client.db.serverconfig.get(client, msg, "logchan")
	
	let embed = client.util.embed()
		.setColor(15844367)
		.setDescription(reason)
		.setThumbnail(msg.guild.iconURL({format: 'png'}))
		.setTimestamp(new Date())
		.addField(":cop: Moderator", `${moderator.user.username} (#${moderator.id})`)
		.addField(":bookmark_tabs: Channel", `${msg.channel.name} (#${msg.channel.id})`)
		.setFooter(`${member.user.tag} (#${member.id})`, member.user.displayAvatarURL({format: 'png'}))

	try {
		member.send(`You were warned in ${msg.guild.name}: ${reason}`);
	} catch(e) {
		if(logs)		embed.addField(':warning: No Direct Message was send', 'Please alert of his warn manually')
		else			moderator.send("Couldn't send the warning. Please notify him manually").catch();
	}

	if (logs && logs.sendable && logs.embedable)
		logs.send(`:warning: ${member.displayName} was warned`, embed);
}