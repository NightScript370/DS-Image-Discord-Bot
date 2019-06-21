const { Listener } = require('discord-akairo');

Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
};

module.exports = class guildMemberAddListener extends Listener {
  constructor() {
    super('guildMemberAdd', {
      emitter: 'client',
      event: 'guildMemberAdd',
      category: 'guild'
    });
  }

  async exec(member) {
  	let name = member.user.username;
  	let owner = member.guild.members.get(member.guild.ownerID);

    let serverconfig = await this.client.db.serverconfig.findOne({guildID: member.guild.id}) || await this.client.setDefaultSettings(member, this.client);

		let logembed = this.client.util.embed()
			.setAuthor(`${member.user.username} has joined`, member.user.displayAvatarURL({format: 'png'}))
			.setDescription(`This server now has ${member.guild.memberCount} members`)
			.setThumbnail(member.guild.iconURL({format: 'png'}))
			.addField('Account Age', member.user.createdAt)
			.setFooter(`${member.user.tag} (#${member.user.id})`);

		let inviteregex = /(http(s)?:\/\/)?(discord(\.gg|app.com\/invite|.io))\/([a-zA-Z0-9]{1,15})?/gmi;
		let plsadd = /(pls\s+add|add\s+me)\s+([\.\:\/\w]{0,32})?\s+(\(tag\))\s+([\w#]{0,32})?/gmi;

		if (name.match(inviteregex) || name.match(plsadd)) {
			if (member.guild.me.hasPermission('BAN_MEMBERS')) {
				if (name.match(inviteregex))	this.client.ban(member, "Invite link in username", owner);
				if (name.match(plsadd))			this.client.ban(member, "Asking for friends in username", owner);
			} else {
				logembed.addField(':warning: Potential Malicious Account', 'I do not have the permissions nessesary to ban him')
			}
		} else {
			let chnl = await member.guild.channels.get(serverconfig.welcomechan.value);

			if (chnl && chnl.permissionsFor(this.client.user).has('SEND_MESSAGES')) {
				if (member.guild.id == '318882333312679936') {
					var embed = this.client.util.embed()
						.setColor("#B6FF00")
						.setAuthor(`Welcome to Mario Making Mods, ${member.user.username}`, member.user.displayAvatarURL({format: 'png'}))
						.setDescription(`<@${member.user.id}>, welcome to the home of Super Mario Maker modding and SMM-like fangame development. `
                          + 'This is a place where you can hang out with a community filled with talented people, and even show off your talents.')
						.addField("Website", "https://mariomods.net", true)
						.addField("Twitter", "https://twitter.com/MarioMakingMods", true)
						.addField("Youtube", "https://www.youtube.com/c/MarioMakingMods", true)
						.setFooter(`Please read #welcome-and-news before participating`)
						.setThumbnail(member.guild.iconURL({format: 'png'}));

          await chnl.send({embed});
				} else {
          await this.sendWelcomeChannel(chnl, serverconfig, member);
				}
			}
		}

		const logs = await member.guild.channels.get(serverconfig.logchan.value);
		if (logs) await logs.send(logembed);
	}

  sendWelcomeChannel(channel, server, member) {
    Array.prototype.random = function() {
      return this[Math.floor(Math.random() * this.length)];
    };

    let rawWelcomeMessage = this.client.db.serverconfig.get(this.client, member, "welcomemessage")
    if (!rawWelcomeMessage) return;
    if (typeof rawWelcomeMessage !== 'string')
      rawWelcomeMessage = rawWelcomeMessage.random()

    let parsedWelcomeMessage = rawWelcomeMessage
      .split("{{guild}}").join(member.guild.name)
      .split("{{server}}").join(member.guild.name)
      .split("{{user}}").join(member.user.username)
      .split("{{member}}").join(member.user.username)
      .split("{{name}}").join(member.user.username)
      .split("{{username}}").join(member.user.username)
      .split("{{membername}}").join(member.user.username)
      .split("{{memberping}}").join(`<@${member.user.id}>`)
      .split("{{userping}}").join(`<@${member.user.id}>`)

    if (parsedWelcomeMessage) {
      console.log(`Sent a welcome message for ${member.user.username} (#${member.user.id}) in ${member.guild.name} (${member.guild.id}): ${parsedWelcomeMessage}`)
      channel.send(parsedWelcomeMessage);
    }
  }
}