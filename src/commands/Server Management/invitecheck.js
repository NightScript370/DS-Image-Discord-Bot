import discordAkairo from 'discord-akairo';

export default class InviteCheckCommand extends discordAkairo.Command {
	constructor() {
		super('invitecheck', {
			aliases: ['invitecheck'],
			category: 'Server Management',
			userPermissions: ['MANAGE_NICKNAMES'],
			description: {
				content: 'Check every user\'s play status for an invite link.',
			},
			channel: 'guild'
		});
	}

	async exec(msg) {
		const members = msg.guild.members.filter(member => member.user.presence.activity && /(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(member.user.presence.activity.name));
		return msg.channel.send(members.map(member => `\`${member.id}\` ${member.displayName}`).join("\n") || "Nobody has an invite link as game name.");
	}
};