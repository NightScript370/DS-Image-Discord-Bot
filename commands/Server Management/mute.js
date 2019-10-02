const { Command } = require('discord-akairo');

module.exports = class MuteCommand extends Command {
	constructor() {
		super('mute', {
			aliases: ["mute", "unmute"],
			category: 'Server Management',
			description: {
                content: [
					"Mutes a user via a mention or user ID. You can optionally include a reason.",
					"The user must be in the server, and the configuration key `mutedrole` must not be null.",
					"This command toggles the mute status of the user (ie. if you run the command two times on the same user, you add then remove the Muted role)."
				]
            },
			examples: ["mute @InfamousGuy003"],
			channelRestriction: 'guild',
			clientPermissions: ["MANAGE_ROLES"],
			userPermissions: ["MANAGE_MESSAGES"],
			args: [
				{
					id: "member",
					type: "member",
					prompt: {
						start: 'Who would you like to mute?',
						retry: 'That\'s not a valid server member! Try again.'
					},
				},
				{
					id: "reason",
					default: null,
					type: "string",
					match: 'rest'
				},
			]
		});
	}

	async exec(msg, { member, reason }) {
		const __ = (k, ...v) => getString(msg.author.lang, k, ...v);

		const mutedRole = msg.guild.config.render("mutedrole");
		if (!mutedRole)
			return msg.util.reply(__("This server needs to have the configuration key `mutedrole` defined in order for this command to work."));

		let author = msg.member;

		if (member.hasPermission("ADMINISTRATOR"))
			return msg.util.reply(__("Administrators can't be muted. It wouldn't affect them."));

		if (member.hasPermission("MANAGE_MESSAGES") && !author.hasPermission("ADMINISTRATOR"))
			return msg.util.reply(__("You need to have the `Administrator` permission in order to mute moderators."));

		if (author.roles.highest.position <= member.roles.highest.position)
			return msg.util.reply(__("You can't mute someone who has an equal or higher role position than you."));

		if (member.id == author.id)
			return msg.util.reply(__("You can't mute yourself!"));

		let hasRole = member.roles.has(mutedRole.id);
		this.client.moderation.mute(this.client, member, author, reason, msg);

		return msg.util.reply(__("{0} was successfully {1}", member.displayName, hasRole ? "unmuted" : "muted"));
	}
};