const client = require('../../yamamura')

module.exports = async (client, member, moderator, reason=null, msg = null, days = null) => {
  let container;

  if (msg)  container = msg;
  else      container = member;

  if (!container.guild) return "not guild";
  if (!container.guild.me.hasPermission('BAN_MEMBERS')) return "no perm";

  let user = member.user ? member.user : member;

  let logChannel = client.db.serverconfig.get(client, container, "logchan");
  let BanLogEmbed = client.util.embed()
    .setColor("#FF0000")
    .setTitle(`:skull_crossbones: ${user.tag} was banned`, user.displayAvatarURL({format: 'png'}))
    .setThumbnail(container.guild.iconURL({format: 'png'}))
    .setDescription(reason)
    .setTimestamp(new Date())
    .addField(":cop: Moderator", `${moderator.user.tag} (#${moderator.id})`)
    .setFooter(`${user.tag} (#${user.id})`);

  if (msg)  BanLogEmbed.addField(":bookmark_tabs: Channel", `${msg.channel.name} (#${msg.channel.id})`);
  if (days) BanLogEmbed.addField(":wastebucket: Messages Pruned", days + " days worth");

  if (msg && !msg.guild.members.has(user))
    msg.guild.members.ban(user, {days: days, reason: reason});
  else {
    try {
      member.send(`You were banned from ${msg.guild.name}: ${reason}`);
    } catch(e) {
      if(logchannel)	BanLogEmbed.addField(":warning: No alert was sent", "Please notify him of his ban manually");
      else            moderator.send("I couldn't alert him that he was banned. Please notify him manually").catch();
    }

    if (days)	await member.ban({days: days, reason: reason}).catch((error) => { console.error(error); return "error when ban";});
    else      await member.ban(reason).catch((error) => { console.error(error); return "error when ban";});
  }

  if (logChannel && logChannel.sendable && logChannel.embedable)
    logChannel.send({embed: BanLogEmbed});
  return true;
}