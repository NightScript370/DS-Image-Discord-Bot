import Command from '../../struct/Command';

export default class TF2Command extends Command {
	constructor() {
		super('TF2', {
			category: 'Game Statistics',
			aliases: ["teamfortress2", "tf2"],
			clientPermissions: ['EMBED_LINKS'],
			description: 'Get stats of any Team Fortress 2 game server.',
			args: [
				{
					id: 'IP',
					prompt: {
						start: (msg) => global.translate(msg.author.lang, 'Which server would you like to get `{0}` statistics from?', 'Team Fortress 2'),
						retry: (msg) => global.translate(msg.author.lang, "That's not a server we can get stats from! Try again.")
					},
					type: 'externalIP',
					match: 'rest'
				},
				{
					id: 'ping',
					type: 'flag',
					flag: '--ping'
				}
			]
		});

		this.examples = ['rust 139.59.13.119:28015'];
	}

	async exec(message, { IP, ping }) {
		let { embed, data } = await this.gameDigServer('tf2', IP, ping);

		let text = `Information on the "${data.name}" Team Fortress 2 server`;
		if (message.guild)
			text += `, requested by ${message.member.displayName}`

		message.util.send(text, {embed});
	}
};