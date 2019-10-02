const { Command } = require('discord-akairo');

module.exports = class WarnCommand extends Command {
	constructor() {
		super('listwarns', {
			aliases: ["listwarns", "listwarn", "warns"],
			category: 'Server Management',
			description: {
				content: 'List a member\'s warnings.'
			},
			channelRestriction: 'guild',
			userPermissions: ["KICK_MEMBERS"],
			args: [
				{
					id: "user",
					type: "user-commando",
					prompt: {
						start: 'Who would you like to list the warnings of?',
						retry: 'That\'s not a valid member! Try again.'
					},
				}
			]
		});
	}

	async exec(msg, { user }) {
		const __ = (k, ...v) => global.getString(msg.author.lang, k, ...v);

		if (msg.guild.members.has(user.id)) {
			let member = msg.guild.members.get(user.id);
			let author = msg.member;

			if (author.roles.highest.position <= member.roles.highest.position)
				return msg.util.reply(__("You can't list the warnings of someone who has a higher role position than you."));

			if (member.hasPermission("MANAGE_MESSAGES") && !author.hasPermission("ADMINISTRATOR"))
				return msg.util.reply(__("You need to have the `Administrator` permission in order to look at a moderators warnings"));

			if (member.hasPermission("ADMINISTRATOR") && msg.guild.ownerId !== author.id)
				return msg.util.reply(__("You need to be the server owner in order to list an Administrators warning"));
		}

		let warns = await this.client.db.infractions.find({guild: msg.guild.id, user: user.id});
		let description = '';

		let text = __("{0}'s warnings - **{1}**", user.username, warns.length);
		let embed = this.client.util.embed()
			.setFooter(__("{0} (#{1})", user.tag, user.id), user.displayAvatarURL({format: 'png'}))
			.setThumbnail(msg.guild.iconURL({format: 'png'}));

		let moderator;
		warns.forEach(async (warn, index) => {
			if (index >= warns.length) return;
			if (1998 < description.length) {
				if (description.length < 2000) description += '...';
				return;
			}
			if(this.client.users.has(warn.moderator))
				moderator = this.client.users.get(warn.moderator)
			else
				moderator = await this.client.users.fetch(warn.moderator).catch((e) => console.error(e, warn.moderator))
			
			if (warns.length < 10) {
				if (moderator)
					await embed.addField(`${index + 1}. Warned by ${moderator.tag} (at ${warn.time}`, warn.reason);
				else
					await embed.addField(`${index + 1}. ${warn.reason}`, `by ${warn.moderator} (at ${warn.time})`);
			} else {
				if(moderator)
					description += `\n **${index + 1}.** ${warn.reason} (by ${moderator} (at ${warn.time})`;
				else
					description += `\n **${index + 1}.** ${warn.reason} (by ${warn[index].moderator} (at ${warn.time})`;
			}
		});

		if (description.length)
			embed.setDescription(description);
		else if (!warns.length)
			embed.setDescription("Congrats - This user does not have any warnings!")

		return msg.util.send(text, {embed: embed});
	}
};