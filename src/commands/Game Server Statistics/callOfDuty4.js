import Command from '../../struct/Command.js';

module.exports = class COD4Command extends Command {
	constructor() {
		super('callOfDuty4', {
			category: 'Game Statistics',
			aliases: ["callOfDuty4", "cod4"],
			clientPermissions: ['EMBED_LINKS'],
			description: {
				content: 'Get stats of any Call of Duty 4: Modern Warfare game server.',
				usage: '<server IP>',
				examples: ['139.59.31.128:27016']
			},
			args: [
				{
					id: 'IP',
					prompt: {
						start: (msg) => global.translate(msg.author.lang, 'Which server would you like to get `{0}` statistics from?', 'Call Of Duty 4: Modern Warfare'),
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
		let {embed, data} = await this.gameDigServer('cod4', IP, ping);
		embed
			.setThumbnail("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/46b63d3c-ae67-464c-9a37-670829b2a157/d9sm9eq-2cb37b2c-7cb4-44f4-aaae-c9642287dbc8.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzQ2YjYzZDNjLWFlNjctNDY0Yy05YTM3LTY3MDgyOWIyYTE1N1wvZDlzbTllcS0yY2IzN2IyYy03Y2I0LTQ0ZjQtYWFhZS1jOTY0MjI4N2RiYzgucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.TS74AwizLzpOEsKiKbJV1H4_9h-2OZ60NizmTBlsWPo")
			.setColor('#D6EAD1')

		let text = `Information on the "${data.name}" Call of Duty 4: Modern Warfare server`;
		if (message.guild)
			text += `, requested by ${message.member.displayName}`

		message.util.send(text, {embed});
	}
};