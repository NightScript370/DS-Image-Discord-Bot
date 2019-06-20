const { findType } = require('./../../Configuration.js');

function getDateTime(date) {
	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;

	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;

	var sec  = date.getSeconds();
	sec = (sec < 10 ? "0" : "") + sec;

	var year = date.getFullYear();

	var month = date.getMonth() + 1;
	month = (month < 10 ? "0" : "") + month;

	var day  = date.getDate();
	day = (day < 10 ? "0" : "") + day;

	return `${year}:${month}:${day}:${hour}:${min}:${sec}`;
}

module.exports = (client, member, reason, moderator, msg) => {
  client.db.infractions.insert({
    user: member.user.id, guild: msg.guild.id, reason: reason, moderator: moderator.id, time: getDateTime(new Date())
  });

  // Alright, I did everything BUT the log sending. I'll let you handle it because you redid the DB stuff
  // OK
  // const logs = msg.guild.channels.find(logchan => logchan.name === client.serverconfig.getProp(member.guild.id, "logchannel"));

  /*
  let data = client.db.serverconfig.findOne(member.guild.id);
  let logChannelObject = data.logchan
  const logs = findType(logChannelObject.type).deserialize(client, msg, logChannelObject.value);
  */
  const logs = client.db.serverconfig.get(client, msg, "logchan")
  
  let embed = client.util.embed()
    .setColor(15844367)
    .setAuthor(`:warning: ${member.user.username} was warned`, member.user.displayAvatarURL)
    .setDescription(reason)
    .setThumbnail(msg.guild.iconURL)
    .setTimestamp(new Date())
    .addField(":cop: Moderator", `${moderator.user.username} (#${moderator.id})`)
    .addField(":bookmark_tabs: Channel", `${msg.channel.name} (#${msg.channel.id})`)
    .setFooter(`${member.user.tag} (#${member.id})`)

  try {
    member.send(`You were warned in ${msg.guild.name}: ${reason}`);
  } catch(e) {
    if(logs)	embed.addField(':warning: No Direct Message was send', 'Please alert of his warn manually')
    else		  moderator.send("Couldn't send the warning. Please notify him manually").catch();
  }

  try {
    if(logs)	logs.send(embed);
  } catch(e) {
    console.error(e);
  }
}