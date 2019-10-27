const { Command } = require('discord-akairo');
const request = require("request");

const { promisify } = require("util");
const req = promisify(request);

module.exports = class NDSBCompatCommand extends Command {
	constructor() {
		super('nds-bootstrap-compatibility', {
			aliases: ['nds-bootstrap-compatibility', 'nds-bootstrap-compatible', "ndsbcompat"],
			category: 'Useful',
			description: {
				content: 'Check a game to see if it\'s compatible with nds-bootstrap.',
				usage: '<name or card ID of game>',
				example: 'Mario Kart DS USA'
			},
			args: [
				{
					id: 'body',
					description: "State either the game ID or the game title (with its region at the end) in order to find out if its compatible",
					type: async (message, gametitle) => {
						if (!gametitle)
							return null;

						try {
							let { body, statusCode } = await req({ url: `http://nds-library-api.glitch.me/${encodeURIComponent(gametitle)}`, json: true });
							if (statusCode !== 200) {
								if (statusCode == 404 && body.message == "invalid title provided")
									return null;

								return 'fail';
							}

							return body;
						} catch (e) {
							return 'backfail';
						}
					},
					prompt: {
						start: "What's the Nintendo DS title you'd like to check if it is compatible with nds-bootstrap?",
						retry: "That is not a thing we can get information for. Try again."
					},
					match: 'rest'
				},
				{
					id: 'flashcard',
					description: "Check for compatibility regarding Bootstrap 4 DS (B4DS in short) with the --flashcard parameter",
					match: 'flag',
					flag: '--flashcard'
				}
			]
		});
	}

	async exec(msg, { body, flashcard }) {
		let infoEmbed = this.client.util.embed();

		if (body === 'fail')
			return msg.util.send("The website is not available. Please try again at a different point in time");

		if (!body['nds-bootstrap'])
			return msg.util.send('This Nintendo-DS title does not have any nds-bootstrap compatibility information. Please try again');

		if (body.title)
			infoEmbed.setTitle(body.title);

		if (body.cardID)
			infoEmbed.setThumbnail(`https://art.gametdb.com/ds/coverS/US/${body.cardID}.png`);

		let { embed, text } = this.getCompat(flashcard ? body['nds-bootstrap'].flashcard : body['nds-bootstrap']['sd-card'], infoEmbed, body)

		if (msg.channel.sendable) {
			if (text)
				msg.channel.send(text, (msg.channel.embedable && embed) ? {embed} : {});
			else if (!text && msg.channel.embedable && embed)
				msg.channel.send({embed: embed});
			else if (!text && !embed)
				msg.channel.send("An error has occured: `Empty message trying to send for the nds-bootstrap-compatibility command`. Please report this to the Yamamura developers")
			else if (!text && !msg.channel.embedable && embed)
				msg.channel.send('Please tell an administrator to enable the `EMBED_LINKS` permission in order for this command to work')
			else
				msg.channel.send('An unknown error has occured. Please report this to the Yamamura developers')
		} else {
			try {
				if (text)
					msg.author.send(text, embed ? {embed} : {});
				else if (!text && embed)
					msg.author.send({embed: embed});
				else if (!text && !embed)
					msg.author.send("An error has occured: `Empty message trying to send for the nds-bootstrap-compatibility command`. Please report this to the Yamamura developers")
			} catch { } // Do nothing here, since the Author most likely disabled the DMS
		}
	}

	embedColor(compatstring, embed) {
		if (typeof compatstring == 'string')
			compatstring = compatstring.toLowerCase();

		switch (compatstring) {
			case true:
			case 'little to no glitches':
			case 'little to no glitches.':
			case 'works':
			case 'works.':
			case 'finally works.':
			case 'finally works':
			case 'Without an AP patch, game does not save, and is unable to progress past first zone.':
			case 'Without an AP patch, game does not save, and is unable to progress past first zone':
				embed.setColor('GREEN');
				break;
			case 'works, however the top screen is not displayed.':
			case 'works, however the top screen is not displayed':
				embed.setColor('BLUE');
				break;
			case false:
			case "freezes on loading screen":
			case "freezes on loading screen.":
			case "boots but into a black screen":
			case "boots but into a black screen.":
			case "boots but into a white screen":
			case "boots but into a white screen.":
			case "boots into a black screen":
			case "boots into a black screen.":
			case "boots into a white screen":
			case "boots into a white screen.":
			case "white screen":
			case "white screen.":
				embed.setColor('RED');
				break;
		}

		return embed
	}

	hasNoInfo(testagainst) {
		return (!testagainst || (testagainst && !testagainst.compatibility && !testagainst.testers));
	}

	getCompat(target, embed, body) {
		if (this.hasNoInfo(target))
			return { embed: null, text: 'This Nintendo-DS title does not have any nds-bootstrap compatibility information for flashcards. Please try again' }

		let text;

		if (target.compatibility) {
			embed = this.embedColor(target.compatibility, embed);

			if (!isEmpty(target.notes))
				embed.addInline('Compatibility', target.notes);
			else
				embed.addInline('Compatibility', target.compatibility);

			if (body.title)
				text = `**${body.title}** - ${target.compatibility}`;
		}

		if (target.testers)
			embed.setFooter(`Tested by ${target.testers.join(", ")}`);

		return {embed, text}
	}
};

function isEmpty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}