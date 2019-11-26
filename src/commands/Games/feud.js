import { Command } from 'discord-akairo';
import get from 'node-superfetch';
import questions from '../../../assets/JSON/feud.json';

export default class FeudCommand extends Command {
	constructor() {
		super('feud', {
			aliases: ['feud', "google-feud", "googlefeud"],
			clientPermissions: ['EMBED_LINKS'],
			category: 'Games',
			description: {
				content: 'Attempt to determine the top suggestions for a Google search.'
			},
		});

		this.hiddenCharacter = "???";
	}

	async exec(msg) {
		const __ = (k, ...v) => global.translate(msg.author.lang, k, ...v);
		let i = 0;

		const current = this.client.commandHandler.games.get(msg.author.id);
		if (current) return msg.util.reply(__("Please wait until the current game of {0} is finished.", current.name));
		this.client.commandHandler.games.set(msg.author.id, { name: this.id });

		let question = questions.random();

		const suggestions = await this.fetchSuggestions(question);
		if (!suggestions)
			return msg.util.reply(__('I could not find any results.'));

		const display = new Array(suggestions.length).fill(this.hiddenCharacter);
		const embed = this.client.util.embed()
			.setColor(0x005AF0)
			.setTitle(`${question}...`)

		let tries = 3;
		while (display.includes(this.hiddenCharacter) && tries) {
			embed
				.setDescription(__('Type the choice you think is a suggestion _without_ the question.'))
				.setFooter(`${tries} ${tries === 1 ? 'try' : 'tries'} remaining!`);

			embed.fields = [];
			for (i = 0; i < suggestions.length; i++)
				embed.addInline(`❯ ${10000 - (i * 1000)}`, display[i]);

			await msg.util.send(embed);

			const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, { max: 1, time: 30000 });
			if (!msgs.size) {
				await msg.util.send('Time is up!');
				break;
			}
			const choice = msgs.first().content.toLowerCase();
			if (suggestions.includes(choice)) display[suggestions.indexOf(choice)] = choice;
			else --tries;
		}

		this.client.commandHandler.games.delete(msg.author.id);
		embed.footer = "";

		let score = 0;
		for (let try_ of display) {
			if (try_ == this.hiddenCharacter) continue;
			let i = display.indexOf(try_);
			let tryScore = 10000 - (i * 1000);
			score += tryScore
		}

		if (display.includes(this.hiddenCharacter))
			embed.setDescription(__("Better luck next time! You scored {0} points.", score));
		else
			embed.setDescription(__("You win! Nice job, master of Google! You scored {0} points.", score));

		embed.fields = [];
		for (i = 0; i < suggestions.length; i++)
			embed.addInline(`❯ ${10000 - (i * 1000)}`, suggestions[i]);

		return msg.util.send(embed);
	}
	
	async fetchSuggestions(question) {
		const { text } = await get('https://suggestqueries.google.com/complete/search')
			.query({ client: 'firefox', q: question });

		const suggestions = JSON.parse(text)[1].filter(suggestion => suggestion.toLowerCase() !== question.toLowerCase());

		if (!suggestions.length) return null;
		return suggestions.map(suggestion => suggestion.toLowerCase().replace(question.toLowerCase(), '').trim());
	}
};