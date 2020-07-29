const { Listener } = require('discord-akairo');

class MissingPermissionsListener extends Listener {
	constructor() {
		super('missingPermissions', {
			event: 'missingPermissions',
			emitter: 'commandHandler',
			category: 'commandHandler'
		});
	}

	exec(message, command, type, missing) {
		const text = {
			client: () => {
				const str = this.missingPermissions(message.channel, this.client.user, missing);
				return `I'm missing ${str} to use that command.`;
			},
			user: () => {
				const str = this.missingPermissions(message.channel, message.author, missing);
				return `You are missing ${(str === undefined ? 'moderator permission' : str)} to use that command.`;
			}
		}[type];

		const tag = message.guild ? `${message.guild.name} :: ${message.author.tag} (${message.author.id})` : `${message.author.tag} (${message.author.id})`;
		console.log(`=> ${command.id} ~ ${type}Permissions`, { tag });

		if (!text) return;
		if (!message.channel.sendable) return;

		message.util.reply(text());
	}

	missingPermissions(channel, user, permissions) {
		const missingPerms = channel.permissionsFor(user).missing(permissions)
			.map(str => {
				switch (str) {
					case 'VIEW_CHANNEL':
						return '`Read Messages`';
					case 'SEND_TTS_MESSAGES':
						return '`Send TTS Messages`';
					case 'USE_VAD':
						return '`Use VAD`';
					default:
						return `\`${str.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())}\``
				}
			});

		return missingPerms.length > 1
			? `${missingPerms.slice(0, -1).join(', ')} and ${missingPerms.slice(-1)[0]}`
			: missingPerms[0];
	}
}

module.exports = MissingPermissionsListener;
