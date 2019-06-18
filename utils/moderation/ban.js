const client = require('../../yamamura')

module.exports = async (client, member, reason, moderator, msg, days = null) => {
  let logchannel;
  let servericon;
  let serverconfig;

  if (msg)  serverconfig = await client.db.serverconfig.findOne({guildID: msg.guild.id}) || await client.setDefaultSettings(msg, this.client);
  else      serverconfig = await client.db.serverconfig.findOne({guildID: member.guild.id}) || await client.setDefaultSettings(member, this.client);

  //Setup some backend security. This is just a backup.
  if (msg !== null) {
    if (!msg.guild) return;
    if (!msg.guild.me.hasPermission('BAN_MEMBERS')) return;

    servericon = msg.guild.iconURL({format: 'png'});
  } else {
    if (!member.guild.me.hasPermission('BAN_MEMBERS')) return;

    servericon = member.guild.iconURL({format: 'png'});
  }

  let user = member.user ? member.user : member;

  let BanLogEmbed = client.util.embed()
    .setColor("#FF0000")
    .setTitle(`:skull_crossbones: ${user.tag} was banned`, user.displayAvatarURL({format: 'png'}))
    .setThumbnail(servericon)
    .setDescription(reason)
    .setTimestamp(new Date())
    .addField(":cop: Moderator", `${moderator.user.tag} (#${moderator.id})`)
    .setFooter(`${user.tag} (#${user.id})`);

  if (msg)  BanLogEmbed.addField(":bookmark_tabs: Channel", `${msg.channel.name} (#${msg.channel.id})`);
  if (days) BanLogEmbed.addField(":wastebucket: Messages Pruned", days + " days worth");

  if (msg)  logchannel = msg.guild.channels.find(logchan => logchan.name === serverconfig.logchan.value);
  else      logchannel = member.guild.channels.find(logchan => logchan.name === serverconfig.logchan.value);

  if (!msg.guild.members.has(user.id))
    msg.guild.members.ban(user.id, {reason: reason});
  else {
    var semember = msg.guild.members.get(member.id);

    try {
      member.send(`You were banned from ${msg.guild.name}: ${reason}`);
    } catch(e) {
      if(logchannel)	BanLogEmbed.addField(":warning: No alert was sent", "Please notify him of his ban manually");
      else            moderator.send("Couldn't send the ban notif. Please notify him manually").catch();
    }

    if (days)	semember.ban({days: days, reason: reason});
    else		semember.ban(reason);
  }

  if (logchannel) logchannel.send({embed: BanLogEmbed});
}