const { Command } = require('discord-akairo');

module.exports = class WarnCommand extends Command {
	constructor() {
		super('listwarns', {
			aliases: ["listwarns", "listwarn"],
			category: 'Server Management',
			description: {
				content: 'List a member\'s warnings.'
			},
			channelRestriction: 'guild',
			userPermissions: ["KICK_MEMBERS"],
			args: [
				{
					id: "user",
					type: "user",
					prompt: {
						start: 'Who would you like to list the warnings of?',
						retry: 'That\'s not a valid member! Try again.'
					},
				}
			]
		});
	}

	async exec(msg, { user }) {
        if (msg.guild.members.has(user)) {
			let member = msg.guild.members.get(user.id);
			let author = msg.member;

			if (author.roles.highest <= members.roles.highest)
				return msg.reply("You can't list the warnings of someone who has a higher role position than you.");

			if (member.hasPermission("MANAGE_MESSAGES") && !author.hasPermission("ADMINISTRATOR"))
				return msg.reply("You need to have the `Administrator` permission in order to look at a moderators warnings");

			if (member.hasPermission("ADMINISTRATOR") && msg.guild.ownerId !== author.id)
				return msg.reply("You need to be the server owner in order to list an Administrators warning")
		}

		let warns = await this.client.db.infractions.find({guild: msg.guild.id, user: user.id});
        let description = '';

        let text = `${user.username}'s warning count - **${warns.length}**`;
		let embed = this.client.util.embed()
			.setAuthor(`A list of ${user.username}'s warnings`, user.displayAvatarURL({format: 'png'}))
			.setFooter(`There are ${warns.length} warnings in total for ${user.tag} (#${user.id})`)
			.setThumbnail(msg.guild.iconURL({format: 'png'}));

        let moderator;
		for(var index in warns) {
            if(this.client.users.get(warns[index].moderator))
                moderator = await this.client.users.get(warns[index].moderator)
            else
                moderator = await this.client.users.fetch(warns[index].moderator).catch((e) => console.error(e, warns[index].moderator))

            if (warns.length > 10) {
                if (moderator)
                    await embed.addField(`${index + 1}. Warned by ${moderator.tag} (at ${warns[index].time}`, warns[index].reason);
                else
                	await embed.addField(`${index + 1}. ${warns[index].reason}`, `by ${warns[index].moderator} (at ${warns[index].time})`);
            } else {
                if(moderator)
                    description += `\n **${index + 1}.** ${warns[index].reason} (by ${moderator} (at ${warns[index].time})`;
                else
                    description += `\n **${index + 1}.** ${warns[index].reason} (by ${warns[index].moderator} (at ${warns[index].time})`;

                if (description.length > 2000) {
                    description += '...';
                    break;
                }
            }
		}

		return msg.util.send({embed: embed});
	}
};