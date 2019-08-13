const { Command } = require('discord-akairo');

module.exports = class KickCommand extends Command {
	constructor() {
		super('kick', {
			aliases: ["boot", 'kick'],
			category: 'Moderation',
			description: {
                content: 'Kick a member via mention, saying their name or inputting the server member\'s ID. You may also specify a reason to the kick'
            },
			examples: ["kick @InfamousGuy003 spamming in #general-talk"],
			channelRestriction: 'guild',
			clientPermissions: ["KICK_MEMBERS"],
			userPermissions: ["KICK_MEMBERS"],
			args: [
				{
					id: "member",
					type: "member",
					prompt: {
                        start: 'Who would you like to kick?',
                        retry: 'That\'s not a valid member! Try again.'
                    },
				},
				{
					id: "reason",
					prompt: {
                        start: 'Why are you kicking this member?',
                        retry: 'That\'s not a valid reason! Try again.'
                    },
					type: "string",
                    match: 'rest'
				}
			]
		});
	}

	exec(msg, { member, reason }) {
		if (!member.kickable)
			return msg.reply("I cannot kick this user");

		if (msg.member.roles.highest <= member.roles.highest)
			return msg.reply("You can't kick someone who has a higher role position than you.");

		if (member.hasPermission("MANAGE_MESSAGES") && !msg.member.hasPermission("ADMINISTRATOR"))
			return msg.reply("You need to have the `Administrator` permission in order to kick moderators");

		if (member.hasPermission("ADMINISTRATOR") && msg.guild.ownerId !== msg.member.id)
			return msg.reply("You need to be the server owner in order to kick Administrators")

        this.client.moderation.kick(this.client, member, reason, msg.member, msg)
            .then(msg.reply(`${member.user.tag} was kicked!`))
            .catch((e) => {
                console.error(e);
                msg.reply(`an error occured when trying to kick a member.`)
            })
    }
};