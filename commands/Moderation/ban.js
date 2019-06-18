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
          match: 'content'
				}
			]
		});
	}

	exec(msg, { user, reason }) {
		if (msg.guild.members.has(user)) {
			user = msg.guild.members.get(user.id);

			if (!user.bannable)
				return msg.reply("I cannot ban this user");

			if (msg.member.roles.highest <= user.roles.highest)
				return msg.reply("You can't ban someone who has a higher role position than you.");

			if (user.hasPermission("MANAGE_MESSAGES") && !msg.member.hasPermission("ADMINISTRATOR"))
				return msg.reply("You need to have the `Administrator` permission in order to ban moderators");

			if (user.hasPermission("ADMINISTRATOR") && msg.guild.ownerId !== msg.member.id)
				return msg.reply("You need to be the server owner in order to ban Administrators")
		}

    this.client.moderation.ban(this.client, user, reason, msg.member, msg)
      .then(msg.reply(`${user.tag} was banned!`))
      .catch((e) => {
        console.error(e);
        msg.reply(`an error occured when trying to ban a member.`)
      })
  }
};