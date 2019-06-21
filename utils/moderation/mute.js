const client = require('../../yamamura')

module.exports = (client, member, reason, moderator, msg) => {
  let logembed;

  if (!member) return "no member";
  if (!member.guild) return "not guild";
  if (!member.guild.me.hasPermission('MANAGE_ROLES')) return "no perms";

  const logchan = msg.guild.channels.find(logchan => logchan.name === this.client.serverconfig.getProp(member.guild.id, "logchannel"));
  const mutedRole = msg.guild.roles.find(muteRole => muteRole.name === this.client.serverconfig.getProp(member.guild.id, "muteRole"));
  if (!mutedRole) return "role doesn't exist";

  if(member.roles.has(mutedRole.id)) {
    member.removeRole(mutedRole);

    logembed = client.util.embed()
      .setColor(0xe00b0b)
      .setAuthor(`${member.user.username}'s mute was removed`, member.user.displayAvatarURL({format: 'png'}))
      .setThumbnail(msg.guild.iconURL({format: 'png'}))
      .setDescription(reason)
      .setTimestamp(new Date())
      .addField(":cop: Moderator", `${moderator.user.tag} (#${moderator.id})`)
      .addField(":bookmark_tabs: Channel", `${msg.channel.name} (#${msg.channel.id})`)
      .setFooter(`${member.user.tag} (#${member.user.id})`);

    try {
      member.send(`You were unmuted from ${msg.guild.name}.`);
    } catch(e) {
      if(logchan)	logembed.addField(":warning: No alert was sent", "Please notify him of his removed mute manually");
      else		moderator.send("Couldn't send the unmute notif. Please notify him manually").catch();
    }

    if (logchan)	logchan.send(logembed);
  } else {
    member.addRole(mutedRole);

    logembed = client.util.embed()
      .setColor(0xe00b0b)
      .setAuthor(`:zipper_mouth: ${member.user.username} was muted`, member.user.displayAvatarURL)
      .setThumbnail(msg.guild.iconURL)
      .setDescription(reason)
      .setTimestamp(new Date())
      .addField(":cop: Moderator", `${moderator.user.tag} (#${moderator.id})`)
      .addField(":bookmark_tabs: Channel", `${msg.channel.name} (#${msg.channel.id})`)
      .setFooter(`${member.user.tag} (#${member.user.id})`);

    try {
      member.send(`You were muted from ${msg.guild.name}: ${reason}`);
    } catch(e) {
      if(logchan)	logembed.addField(":warning: No alert was sent", "Please notify him of his removed mute manually")
      else		moderator.send("Couldn't send the unmute notif. Please notify him manually").catch();
    }

    if (logchan)	logchan.send(logembed);
  }
}