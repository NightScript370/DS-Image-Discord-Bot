import discordAkairo from 'discord-akairo';
const request = import('util').promisify(import('request'));

export default class AmiiboCommand extends discordAkairo.Command {
	constructor() {
		super('amiibo', {
			aliases: ['amiibo'],
			category: 'Useful',
			clientPermissions: ['EMBED_LINKS'],
			description: {
				content: 'Replies with information on an amiibo. We currently use amiiboapi.com but will soon be using our very own.',
				usage: '<amiibo name>',
				examples: ['Mario', 'Mario - Gold Edition', 'Sonic the hedgehog']
			},
			args: [
				{
					id: 'name',
					description: "This parameter is for the Amiibo you'd like to get information on.",
					type: 'string',
					prompt: {
						start: 'Which Amiibo would you like to get information on?',
						retry: "That's not something we can get information on. Try again"
					},
					match: 'content'
				}
			]
		});
	}

	async exec(msg, { name }) {
		let { body, statusCode } = await request({ url: 'http://www.amiiboapi.com/api/amiibo/?name='+encodeURIComponent(name), json: true });

		if (statusCode == 404)
			return msg.util.reply("The amiibo was not found. Please check your spelling and try again");

		let amiibos = body.amiibo.slice(0, 3);

		for (var amiibo of amiibos) {
			let embed = this.client.util.embed()
				.setAuthor(`Amiibo - ${amiibo.name}`, `https://vignette.wikia.nocookie.net/videogames-fanon/images/1/1c/Amiibo_icon.png/revision/latest?cb=20160507010201`)
				.setImage(amiibo.image)
				.addInline("Series", `**Amiibo:** ${amiibo.amiiboSeries} \n **Franchise** ${amiibo.gameSeries}`)
				.addInline("Releases", buildReleases(amiibo.release))
				.setFooter(`Type: ${amiibo.type}`);

			if (amiibo.amiiboSeries == "Super Smash Bros.") {
				embed.setThumbnail("https://hey-hey-listen.com/wp-content/uploads/2018/03/Smash_Ball_White-1.png")
			} else if (amiibo.amiiboSeries == "Yoshi's Wooly World") {
				embed.setThumbnail("https://cdn.glitch.com/6959811c-1d7b-489f-b1f0-281ae0d8936c%2FSimple%20Yoshi.png?1556214310071")
			}

			msg.util.send(embed);
		}
	}
};

function buildReleases(releases) {
	let flags = '';

	if (!empty(releases)) {
		if (!empty(releases.na)) flags += `:flag_us: ${releases.na} \n`;
		if (!empty(releases.eu)) flags += `:flag_eu: ${releases.eu} \n`;
		if (!empty(releases.jp)) flags += `:flag_jp: ${releases.jp} \n`;
		if (!empty(releases.au)) flags += `:flag_au: ${releases.au} \n`;
	}

	return flags
}

function empty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}