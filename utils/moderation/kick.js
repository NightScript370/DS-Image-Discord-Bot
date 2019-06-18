const { findType } = require('./../../Configuration.js');

module.exports = async (client, member, reason, moderator, msg) => {
  let serverconfig;

  //Setup some backend security. This is just a backup.
  if(!msg.guild) return;
  if(!msg.guild.me.hasPermission('KICK_MEMBERS')) return;
  if(!msg.guild.members.has(member.id)) return;

  if (msg) {
    let data = client.db.serverconfig.findOne(msg.guild.id);
    let logChannelObject = data.logchan
    let logs = findType(logChannelObject.type).deserialize(client, msg, logChannelObject.value);
  } else {
    let data = client.db.serverconfig.findOne(member.guild.id);
    let logChannelObject = data.logchan
    let logs = findType(logChannelObject.type).deserialize(client, msg, logChannelObject.value);
  }

  if (msg)  serverconfig = await client.db.serverconfig.findOne({guildID: msg.guild.id}) || await client.setDefaultSettings(msg, this.client);
  else      serverconfig = await client.db.serverconfig.findOne({guildID: member.guild.id}) || await client.setDefaultSettings(member, this.client);

  const logs = msg.guild.channels.find(logchan => logchan.name === serverconfig.logchan.value);

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
    if(logs)	embed.addField(":warning: No alert was sent", "Please notify him of his kick manually");
    else		moderator.send("Couldn't send the kick notification. Please notify him manually").catch();
  }

  member.kick(reason);

  if(logs)	logs.send(embed);
}