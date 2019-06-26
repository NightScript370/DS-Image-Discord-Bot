const { Command } = require('discord-akairo');

module.exports = class BanCommand extends Command {
	constructor() {
		super('ban', {
			aliases: ["ban-hammer", "b-h", 'ban'],
			category: 'Moderation',
			description: {
                content: 'Bans a user via a mention or user ID. You can use it on users not even in the serve.'
            },
			examples: ["ban @InfamousGuy003 spamming in #general-talk"],
			channelRestriction: 'guild',
			clientPermissions: ["BAN_MEMBERS"],
			userPermissions: ["BAN_MEMBERS"],
			args: [
				{
					id: "user",
					type: "user-commando",
					prompt: {
                        start: 'Who would you like to ban?',
                        retry: 'That\'s not a valid user! Try again.'
                    },
				},
				{
					id: "reason",
					default: "No reason.",
					type: "string",
                    match: 'rest'
				}
			]
		});
	}

	async exec(msg, { user, reason }) {
		let banList;

		if (msg.guild.members.has(user)) {
			let member = msg.guild.members.get(user.id);
			let author = msg.member;

			if (!member.bannable)
				return msg.reply("I cannot ban this user");

			if (author.roles.highest <= member.roles.highest)
				return msg.reply("You can't ban someone who has a higher role position than you.");

			if (member.hasPermission("MANAGE_MESSAGES") && !author.hasPermission("ADMINISTRATOR"))
				return msg.reply("You need to have the `Administrator` permission in order to ban moderators");

			if (member.hasPermission("ADMINISTRATOR") && msg.guild.ownerId !== author.id)
				return msg.reply("You need to be the server owner in order to ban Administrators");
			
			if (member.id == author.id)
				return msg.reply("You can't ban yourself!");
		} else {
			banList = await msg.guild.fetchBans();
			if (banList.get(user.id))
				msg.reply(`${user.tag} was already banned`)
		}

		try {
			let ban = await this.client.moderation.ban(this.client, user, reason, msg.member, msg);
			if (typeof ban == "boolean" && ban) {
				banList = await msg.guild.fetchBans();
				if (banList.get(user.id))
					msg.reply(`${user.tag} was banned`);
				else
					msg.reply(`The bot replied that the user was banned but Discord's ban list says otherwise. You should never see this error. Please report this issue to the yamamura developers.`);
			} else {
				if (ban == "no perms")
					msg.reply(`I do not have the permission to ban ${user.tag}`);
				else
					msg.reply(`The user was not banned due to an internal error`);
			}
		} catch (e) {
			console.error(e);
			msg.reply(`an unidentifiable error occured while trying to ban the user.`);
		}
	}
};