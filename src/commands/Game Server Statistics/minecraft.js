const Command = require("./../../struct/Command.js")
const promisify = require("util")

module.exports = class MinecraftServerCommand extends Command {
	constructor() {
		super('minecraft', {
			category: 'Game Statistics',
			aliases: ["minecraft", "mc", "マインクラフト", "マイクラ"],
			clientPermissions: ['EMBED_LINKS'],
			description: {
				content: 'Get stats of any Minecraft game server.',
				usage: '<server IP>',
				examples: ['139.59.31.129:25565']
			},
			args: [
				{
					id: 'IP',
					prompt: {
						start: (msg) => global.translate(msg.author.lang, 'Which server would you like to get `{0}` statistics from?', 'Minecraft'),
						retry: (msg) => global.translate(msg.author.lang, "That's not a server we can get stats from! Try again.")
					},
					type: 'string',
					match: 'rest'
				},
				{
					id: 'API',
					description: 'Due to the many different version of minecraft, some of them are incompatible with gamedig. Therefore, we have three options for APIs: minestat (for older versions), gamedig (default) and mcsrvstat.us (most compatible but slowest)',
					type: ['minestat', 'gamedig', 'mcsrvstat.us'],
					match: 'option',
					flag: 'API:',
					default: 'gamedig'
				},
				{
					id: 'ping',
					type: 'flag',
					flag: '--ping'
				}
			]
		});
	}

	async exec(message, { IP, API, ping }) {
		IP = IP.split(':');
		let fullIP = IP.join(':');

		let host = IP[0];
		let port = IP[1] ? parseInt(IP[1]) : 25565;

		let MineEmbed = await this.client.util.embed()
			.setColor('GREEN')
			.setImage('https://cache.gametracker.com/server_info/'+host+':'+port+'/b_560_95_1.png')

		switch (API) {
			case 'minestat':
				const minestat = promisify(require('../../utils/minestat'))
				let result = await minestat(host, port);

				if(result.online) {
					MineEmbed
						.setDescription(`:large_blue_circle: Server is online.`)
						.setFooter(`Players: ${result.current_players}/${result.max_players}`);

					if (this.isGood(this.rvMColor(result.motd))) {
						MineEmbed.addField("Message of the Day", this.rvMColor(result.motd));
					}
				} else {
					MineEmbed.setDescription(`:red_circle: Server is offline`);
				}

				message.util.send(`Minecraft Server Stats: ${result.address}:${result.port}`, {embed: MineEmbed});
				break;
			case 'gamedig':
				let { embed, data } = await this.gameDigServer('minecraft', fullIP, ping);
				embed.setColor('GREEN')

				let text = `Information on the \`${fullIP}\` Minecraft (Java Edition) server`;
				if (message.guild)
					text += `, requested by ${message.member.displayName}`

				message.util.send(text, {embed});
				break;
			case 'mcsrvstat.us':
				const request = promisify(require("request"));

				let { body, statusCode } = await request({ url: 'https://api.mcsrvstat.us/2/'+encodeURIComponent(host), json: true });
				if (statusCode !== 200) {
					console.error(`[ERROR][Minecraft Command][api.mcsrvstat.us] statusCode: ${statusCode}`)
					return msg.reply('An error has occured replating to the API selected. Please try again with a different API, or contact the Yamamura developers');
				}

				if (body.hostname)
					MineEmbed.addInline(`Server IP`, '`'+fullIP+'`');

				if (body.motd)
					MineEmbed.setDescription(body.motd.clean);

				if (body.players) {
					let players = `${body.players.online}/${body.players.max}`;
					if (this.isGood(body.players.list))
						players += '```http\n'+body.players.list.join('\n')+'```';

					MineEmbed.addField("Players", players);
				}

				message.util.send(`Minecraft Server Stats: ${body.hostname ? body.hostname : fullIP}`, {embed: MineEmbed});
				break;
		}
	}
};