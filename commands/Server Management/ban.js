const { Command } = require('discord-akairo');

module.exports = class BanCommand extends Command {
	constructor() {
		super('ban', {
			aliases: ["ban-hammer", "b-h", 'ban'],
			category: 'Server Management',
			description: {
				content: 'Bans a user via a mention or user ID. You can use it on users not even in the server.'
			},
			examples: ["ban @InfamousGuy003 spamming in #general-talk"],
			channelRestriction: 'guild',
			clientPermissions: ["BAN_MEMBERS"],
			userPermissions: ["BAN_MEMBERS"],
			args: [
				{
					id: "user",
					description: 'This parameter would be the user you would like to ban. It can be a mention, the name of someone in a server or the ID of someone not in the server',
					type: "user-commando",
					prompt: {
						start: (msg) => global.getString(msg.author.lang, 'Who would you like to ban?'),
						retry: (msg) => global.getString(msg.author.lang, "That's not something we can ban! Try again.")
					},
				},
				{
					id: "reason",
					description: 'This field is for the reason you are banning the user',
					default: '',
					type: "string",
					match: 'rest'
				},
				{
					id: "check",
					description: 'This field is for checking the ban list if the user really was banned or not.',
					match: 'flag',
					flag: '--check'
				},
				{
					id: 'days',
					description: 'This field is for the amount of days of messages from the user you would like to delete.',
					type: 'number',
					default: null,
					match: 'option',
					flag: 'msgdaysdel:'
				}
			]
		});
	}

	async exec(msg, { user, reason, check, days }) {
		const __ = (k, ...v) => global.getString(message.author.lang, k, ...v)

		let banList;
		let member;

		if (msg.guild.members.has(user.id)) {
			member = msg.guild.members.get(user.id);
			let author = msg.member;

			if (!member.bannable)
				return msg.util.reply(__("I cannot ban this user."));

			if (author.roles.highest.position <= member.roles.highest.position)
				return msg.util.reply(__("You can't ban someone who has an equal or higher role position than you."));

			if (member.hasPermission("MANAGE_MESSAGES") && !author.hasPermission("ADMINISTRATOR"))
				return msg.util.reply(__("You need to have the `Administrator` permission in order to ban moderators."));

			if (member.hasPermission("ADMINISTRATOR") && msg.guild.owner.id !== author.id)
				return msg.util.reply(__("You need to be the server owner in order to ban Administrators."));

			if (member.id == author.id)
				return msg.util.reply(__("You can't ban yourself!"));
		} else {
			banList = await msg.guild.fetchBans();
			if (banList.get(user.id))
				return msg.util.reply(__('{0} was already banned', user.tag));
		}

		let ban = await this.client.moderation.ban(this.client, (member ? member : user), msg.member, reason, msg, days);
		if (typeof ban == "boolean" && ban) {
			if (!check)
				return msg.util.reply(__('{0} is now banned', user.tag));
			else {
				banList = await msg.guild.fetchBans();
				if (banList.get(user.id))
					msg.util.reply(__('{0} is now banned', user.tag));
				else
					msg.util.reply(__("The bot replied that the user was banned but Discord's ban list says otherwise. You should never see this error. Please report this issue to the yamamura developers."));
			}
		} else {
			if (ban == "no perms")
				msg.util.reply(__('I do not have the permission to ban {0}', user.tag));
			else
				msg.util.reply(__('An internal error occured. {0} may or may not have been banned', user.tag));
		}
	}
};