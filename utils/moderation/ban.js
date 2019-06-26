const client = require('../../yamamura')

module.exports = async (client, member, reason, moderator, msg = null, days = null) => {
  let container;

  if (msg)  container = msg;
  else      container = member;

  let serverconfig = await client.db.serverconfig.findOne({guildID: container.guild.id}) || await client.setDefaultSettings(container, this.client);

  if (!container.guild) return "not guild";
  if (!container.guild.me.hasPermission('BAN_MEMBERS')) return "no perm";

  let user = member.user ? member.user : member;

  let logChannel = container.guild.channels.get(serverconfig.logchan.value);
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
    msg.guild.members.ban(user, {reason: reason});
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

  if (logChannel) logChannel.send({embed: BanLogEmbed});
  return true;
}