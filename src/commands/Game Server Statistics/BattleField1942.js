import Command from '../../struct/Command.js';

module.exports = class BF1942Command extends Command {
	constructor() {
		super('BattleField1942', {
			category: 'Game Statistics',
			aliases: ["BattleField1942", "bf1942"],
			clientPermissions: ['EMBED_LINKS'],
			description: {
				content: 'Get stats of any Battlefield: 1942 game server.',
				usage: '<server IP>',
				examples: ['163.172.13.221:14567']
			},
			args: [
				{
					id: 'IP',
					prompt: {
						start: (msg) => global.translate(msg.author.lang, 'Which server would you like to get `{0}` statistics from?', 'Battlefield: 1942'),
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
		let {embed, data} = await this.gameDigServer('bf1942', IP, ping);
		embed.setColor("BLUE")

		let text = `Information on the "${data.name}" BattleField 1942 server`;
		if (message.guild)
			text += `, requested by ${message.member.displayName}`

		message.util.send(text, {embed});
	}
};