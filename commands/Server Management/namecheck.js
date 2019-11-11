import Command from 'discord-akairo';

export default class NameCheckCommand extends Command {
	constructor() {
		super('namecheck', {
			aliases: ['namecheck'],
			category: 'Server Management',
			userPermissions: ['MANAGE_NICKNAMES'],
			description: {
				content: 'Checks a user\'s name for weird characters.',
			},
			channel: 'guild'
		});
	}

	async exec(message) {
		const members = message.guild.members.filter(member => member.displayName && !member.displayName.match(/^[A-Za-z0-9._'-@]/g));
		return message.channel.send(members.map(member => `\`${member.id}\` ${member.displayName}`).join("\n") || global.translate(message.author.lang, "Nobody has a name with weird characters."));
	}
};