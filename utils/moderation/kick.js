const { findType } = require('./../../Configuration.js');

module.exports = async (client, member, reason, moderator, msg) => {
  let serverconfig;

  //Setup some backend security. This is just a backup.
  if (!member.guild) return;
  if (!member.guild.me.hasPermission('KICK_MEMBERS')) return;
  if (msg && !msg.guild.members.has(member.id)) return;

  let logChannel = client.db.serverconfig.get(client, member, "logchan");
  let embed = client.util.embed()
    .setColor(0xe00b0b)
    .setTitle(`:boot: ${member.user.username} was kicked`, member.user.displayAvatarURL)
    .setThumbnail(msg.guild.iconURL)
    .setDescription(reason)
    .setTimestamp(new Date())
    .addField(":cop: Moderator", `${moderator.user.tag} (#${moderator.id})`, true)
    .addField(":bookmark_tabs: Channel", `${msg.channel.name} (#${msg.channel.id})`, true)
    .setFooter(`${member.user.tag} (#${member.id})`);

  try {
    member.send(`You were kicked from ${msg.guild.name}: ${reason}`);
  } catch(e) {
    if(logChannel)
      embed.addField(":warning: No alert was sent", "Please notify him of his kick manually");
    else
      moderator.send("Couldn't send the kick notification. Please notify him manually").catch();
  }

  member.kick(reason);
  if(logChannel && logChannel.sendable && logChannel.embedable)
    logs.send({embed});
}