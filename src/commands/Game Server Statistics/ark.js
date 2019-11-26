import Command from '../../struct/Command.js';

export default class ARKCommand extends Command {
	constructor() {
		super('ark', {
			category: 'Game Statistics',
			aliases: ["ark", "arkse"],
			clientPermissions: ['EMBED_LINKS'],
			description: {
				content: 'Get stats of any Ark: Survival Evolved game server.',
				usage: '<server IP>',
				examples: ['163.172.13.221:14567']
			},
			args: [
				{
					id: 'IP',
					prompt: {
						start: (msg) => global.translate(msg.author.lang, 'Which server would you like to get `{0}` statistics from?', 'ARK: Survival Evolved'),
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
	}

	async exec(message, { IP, ping }) {
		let {embed, data} = await this.gameDigServer('arkse', IP, ping);
		embed.setColor("BLUE")

		let text = `Information on the "${data.name}" Ark: Survival Evolved server`;
		if (message.guild)
			text += `, requested by ${message.member.displayName}`

		message.util.send(text, {embed});
	}
};