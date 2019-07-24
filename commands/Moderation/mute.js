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
					id: "user",
					type: "user-commando",
					prompt: {
                        start: 'Who would you like to mute?',
                        retry: 'That\'s not a valid user! Try again.'
                    },
				},
				{
					id: "reason",
					default: "No reason.",
					type: "string",
                    match: 'rest'
				},
			]
		});
	}

	async exec(msg, { user, reason }) {
		const mutedRole = this.client.db.serverconfig.get(this.client, msg, "mutedrole");
		if (!mutedRole)
			return msg.reply(getString(msg.author.lang, "You need to have the configuration key `mutedrole` set in order for this command to work."));

		if (!msg.guild.members.has(user)) 
			return msg.reply(getString(msg.author.lang, "The member you wanted to mute needs to be in this server in order for this command to work."));

		let member = msg.guild.members.get(user.id);
		let author = msg.member;

		if (author.roles.highest <= member.roles.highest)
			return msg.reply("You can't mute someone who has a higher role position than you.");

		if (member.hasPermission("MANAGE_MESSAGES") && !author.hasPermission("ADMINISTRATOR"))
			return msg.reply("You need to have the `Administrator` permission in order to mute moderators");

		if (member.hasPermission("ADMINISTRATOR"))
			return msg.reply("Administrators can't be muted. It wouldn't affect them.");
		
		if (member.id == author.id)
			return msg.reply("You can't mute yourself!");

		try {
			var hasRole = member.roles.has(mutedRole.id);
			if (hasRole)
				member.roles.remove(mutedRole, reason)
			else
				member.roles.add(mutedRole, reason)
		} catch (e) {
			console.error(e);
			msg.reply(`an error occured while trying to ban the user. Report this error to the Yamamura developers: ${e.message}`);
		}
	}
};