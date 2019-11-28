import discordAkairo from 'discord-akairo';
import get from 'node-superfetch';

export default class DidYouMeanCommand extends discordAkairo.Command {
	constructor() {
		super('didyoumean', {
			category: 'Image Edits',
			aliases: ["didyoumean", 'did-you-mean'],
			description: {
				content: 'Google-like did you mean image command',
			},
			args: [
				{
					id: 'top',
					type: (msg, phrase) => {
						if (!phrase || phrase.length >= 45) return null;
						return phrase;
					},
					prompt: {
						start: "What would you like to search google with?",
						retry: "That's not something that we can say on the google search field. Try again!"
		  			}
				},
				{
					id: 'bottom',
					type: (msg, phrase) => {
						if (!phrase || phrase.length >= 40) return null;
						return phrase;
					},
					prompt: {
						start: "What would you like google to correct your sentence with?",
						retry: "That's not a correction that google can give. Try again!"
		  			}
				}
			]
		});
	}

	async exec(message, { top, bottom }) {
		const { body } = await get('https://api.alexflipnote.xyz/didyoumean')
			.query({ top, bottom });
		return message.util.send({ files: [{ attachment: body, name: 'didyoumean.png' }] });
	}
};