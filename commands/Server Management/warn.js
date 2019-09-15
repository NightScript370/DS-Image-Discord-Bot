const { Command } = require('discord-akairo');

module.exports = class WarnCommand extends Command {
	constructor() {
		super('warn', {
			aliases: ["warn"],
			category: 'Server Management',
			description: {
				content: 'Warns a member via mention, saying their name or inputting the server member\'s ID. You may also specify a reason to the warn.'
			},
			examples: ["warn @InfamousGuy003 spamming in #general-talk"],
			channelRestriction: 'guild',
			userPermissions: ["KICK_MEMBERS"],
			args: [
				{
					id: "member",
					type: "member",
					prompt: {
						start: 'Who would you like to warn?',
						retry: 'That\'s not a valid member! Try again.'
					},
				},
				{
					id: "reason",
					prompt: {
						start: 'Why are you warning this member?',
						retry: 'That\'s not a valid reason! Try again.'
					},
					type: "string",
					match: 'rest'
				}
			]
		});
	}

	exec(msg, { member, reason }) {
		if (msg.member.roles.highest.position <= member.roles.highest.position)
			return msg.reply("You can't warn someone who has a higher role position than you.");

		if (member.hasPermission("MANAGE_MESSAGES") && !msg.member.hasPermission("ADMINISTRATOR"))
			return msg.reply("You need to have the `Administrator` permission in order to warn moderators");

		if (member.hasPermission("ADMINISTRATOR") && msg.guild.owner.id != msg.member.id)
			return msg.reply("You need to be the server owner in order to warn Administrators")

		try {
			this.client.moderation.warn(this.client, member, reason, msg.member, msg);
			msg.util.reply(`${member.displayName} was warned!`);
		} catch(e) {
			console.error(e);
		}
	}
};