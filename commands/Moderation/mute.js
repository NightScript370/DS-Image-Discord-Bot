const { Command } = require('discord-akairo');

module.exports = class MuteCommand extends Command {
	constructor() {
		super('mute', {
			aliases: ["mute", "unmute"],
			category: 'Moderation',
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

		const mutedRole = this.client.db.serverconfig.get(this.client, msg, "mutedrole");
		if (!mutedRole)
			return msg.reply(__("You need to have the configuration key `mutedrole` set in order for this command to work."));

		let author = msg.member;

		if (member.hasPermission("ADMINISTRATOR"))
			return msg.reply(__("Administrators can't be muted. It wouldn't affect them."));

		if (member.hasPermission("MANAGE_MESSAGES") && !author.hasPermission("ADMINISTRATOR"))
			return msg.reply(__("You need to have the `Administrator` permission in order to mute moderators."));

		if (author.roles.highest.position <= member.roles.highest.position)
			return msg.reply(__("You can't mute someone who has a higher role position than you."));
		
		if (member.id == author.id)
			return msg.reply(__("You can't mute yourself!"));

		try {
			var hasRole = member.roles.has(mutedRole.id);
			if (hasRole)
				member.roles.remove(mutedRole, reason)
			else
				member.roles.add(mutedRole, reason)

			return msg.reply(__(hasRole ? "{0} was successfully unmuted" : "{0} was successfully muted", member.displayName));
		} catch (e) {
			console.error(e);
			msg.reply(__("an error occured while trying to mute the user. Report this error to the Yamamura developers: `{0}`", e.messsage));
		}
	}
};