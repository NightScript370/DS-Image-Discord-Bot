const { Command } = require('discord-akairo');

module.exports = class NameCheckCommand extends Command {
  constructor() {
    super('namecheck', {
      aliases: ['namecheck'],
      category: 'Moderation',
      userPermissions: ['MANAGE_NICKNAMES'],
      description: {
				content: 'Checks a user\'s name for weird characters.',
			},
      channelRestriction: 'guild'
    });
  }

  async exec(msg) {
		const members = msg.guild.members.filter(member => member.displayName && !member.displayName.match(/^[A-Za-z0-9._'-@]/g));
		return msg.channel.send(members.map(member => `\`${member.id}\` ${member.displayName}`).join("\n") || global.getString(msg.author.lang, "Nobody has a name with weird characters."));
  }
};