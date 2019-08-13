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
                        start: 'Who would you like to ban?',
                        retry: 'That\'s not something we can ban! Try again.'
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
				msg.reply(`${user.tag} was already banned`);
		}

		let ban = await this.client.moderation.ban(this.client, user, msg.member, reason, msg, days);
		if (typeof ban == "boolean" && ban) {
			if (!check)
				return msg.reply(`${user.tag} was banned`);
			else {
				banList = await msg.guild.fetchBans();
				if (banList.get(user.id))
					msg.reply(`${user.tag} was banned`);
				else
					msg.reply(`The bot replied that the user was banned but Discord's ban list says otherwise. You should never see this error. Please report this issue to the yamamura developers.`);
			}
		} else {
			if (ban == "no perms")
				msg.reply(`I do not have the permission to ban ${user.tag}`);
			else
				msg.reply(`The user was not banned due to an internal error`);
		}
	}
};