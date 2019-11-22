import { Listener } from 'discord-akairo';

export default class guildMemberAddListener extends Listener {
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

		let logembed = this.client.util.embed()
			.setDescription(`This server now has ${member.guild.memberCount} members`)
			.setThumbnail(member.guild.iconURL({format: 'png'}))
			.addField('Account Age', member.user.createdAt)
			.setFooter(`${member.user.tag} (#${member.user.id})`, member.user.displayAvatarURL({format: 'png'}));

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
			let chnl = await member.guild.config.render("welcomechan")

			if (chnl && chnl.sendable) {
				if (member.guild.id == '318882333312679936' && chnl.embedable) {
					var embed = this.client.util.embed()
						.setColor("#B6FF00")
						.setAuthor(`New User: ${member.user.username}`, member.user.displayAvatarURL({format: 'png'}))
						.setDescription(`<@${member.user.id}>, Welcome to Mario Making Mods, the community dedicated to modding each Super Mario Maker title.
Don't forget to subscribe to our Youtube channel and check out our website. `)
						.addField("Website", "https://mariomods.net", true)
						.addField("Twitter", "https://twitter.com/MarioMakingMods", true)
						.addField("Youtube", "https://www.youtube.com/c/MarioMakingMods", true)
						.setFooter(`Please read #welcome-and-news before participating`)
						.setThumbnail(member.guild.iconURL({format: 'png'}));

					await chnl.send({embed});
				} else {
					let welcomeMessage = member.guild.config.data.welcomemessage;
					if (welcomeMessage) {
						if (typeof welcomeMessage !== 'string')
							welcomeMessage = welcomeMessage.random()

						welcomeMessage = welcomeMessage
							.replaceAll(["{{server}}", "{{guild}}"], member.guild.name)
							.replaceAll(["{{user}}", "{{name}}"], member.user.username)
							.replaceAll("{{ping}}", `<@${member.user.id}>`)
							.replaceAll("{{servercount}}", member.guild.memberCount);

						chnl.send(welcomeMessage);
					}
				}
			}
		}

		let logchannel = await member.guild.config.render("logchan")
		if (logchannel && logchannel.sendable && logchannel.embedable)
			logchannel.send(`${member.user.username} has joined`, {embed: logembed});
	}
}