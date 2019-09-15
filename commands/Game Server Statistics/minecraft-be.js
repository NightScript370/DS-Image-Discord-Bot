const Command = require('../../struct/Command');

module.exports = class MCBedrockCommand extends Command {
	constructor() {
		super('minecraft-be', {
			category: 'Game Server Statistics',
			aliases: ["minecraft-be", "mcbe"],
			clientPermissions: ['EMBED_LINKS'],
			description: 'Get stats of any Minecraft: Bedrock Edition game server.',
			args: [
				{
					id: 'IP',
					prompt: {
						start: (msg) => global.getString(msg.author.lang, 'Which server would you like to get `{0}` statistics from?', 'Minecraft: Bedrock Edition'),
						retry: (msg) => global.getString(msg.author.lang, "That's not a server we can get stats from! Try again.")
					},
					type: 'string',
					match: 'rest'
				},
				{
					id: 'ping',
					type: 'flag',
					flag: '--ping'
				}
			]
		});

		this.examples = ['minecraft-be 138.201.33.99:19132'];
	}

	async exec(message, { IP, ping }) {
		let { embed, data } = await this.gameDigServer('minecraftbe', IP, ping);
		embed
			.setThumbnail(`${this.client.website.URL}/icons/minecraft.png`)
			.setColor("GREEN")

		let text = `Information on the "${data.name}" Minecraft (Bedrock Edition) server`;
		if (message.guild)
			text += `, requested by ${message.member.displayName}`

		message.util.send(text, {embed});
	}
};