import Command from 'discord-akairo';

export default class KickCommand extends Command {
	constructor() {
		super('kick', {
			aliases: ["boot", 'kick'],
			category: 'Server Management',
			description: {
				content: 'Kick a member via mention, saying their name or inputting the server member\'s ID. You may also specify a reason to the kick'
			},
			examples: ["kick @InfamousGuy003 spamming in #general-talk"],
			channel: 'guild',
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
					description: "This field is for the reason you're willing to kick the person",
					default: '',
					type: "string",
                    match: 'rest'
				}
			]
		});
	}

	exec(msg, { member, reason }) {
		if (!member.kickable)
			return msg.reply("I cannot kick this user");

		if (msg.member.roles.highest.position <= member.roles.highest.position)
			return msg.reply("You can't kick someone who has an equal or higher role position than you.");

		if (member.hasPermission("MANAGE_MESSAGES") && !msg.member.hasPermission("ADMINISTRATOR"))
			return msg.reply("You need to have the `Administrator` permission in order to kick moderators");

		if (member.hasPermission("ADMINISTRATOR") && msg.guild.owner.id !== msg.member.id)
			return msg.reply("You need to be the server owner in order to kick Administrators")

        this.client.moderation.kick(this.client, member, reason, msg.member, msg)
            .then(msg.reply(`${member.user.tag} was kicked!`))
    }
};