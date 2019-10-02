const { Command } = require('discord-akairo');
const request = require('node-superfetch');
const questions = require('../../assets/JSON/feud');

module.exports = class FeudCommand extends Command {
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
		const __ = (k, ...v) => global.getString(msg.author.lang, k, ...v);

		const current = this.client.commandHandler.games.get(msg.author.id);
		if (current) return msg.util.reply(__("Please wait until the current game of {0} is finished.", current.name));
		this.client.commandHandler.games.set(msg.author.id, { name: this.id });

		let question = questions[Math.floor(Math.random() * questions.length)];

		const suggestions = await this.fetchSuggestions(question);
		if (!suggestions)
			return msg.util.reply(__('I could not find any results.'));

		const display = new Array(suggestions.length).fill(this.hiddenCharacter);
		let tries = 3;
		while (display.includes(this.hiddenCharacter) && tries) {
			const embed = this.client.util.embed()
				.setColor(0x005AF0)
				.setTitle(`${question}...`)
				.setDescription(__('Type the choice you think is a suggestion _without_ the question.'))
				.setFooter(`${tries} ${tries === 1 ? 'try' : 'tries'} remaining!`);

			for (let i = 0; i < suggestions.length; i++)
				embed.addField(`❯ ${10000 - (i * 1000)}`, display[i], true);

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

		let score = 0;
		for (let try_ of display) {
			if (try_ == this.hiddenCharacter) continue;
			let i = display.indexOf(try_);
			let tryScore = 10000 - (i * 1000);
			score += tryScore
		}

		let resultEmbed = this.client.util.embed()
			.setColor(0x005AF0)
			.setTitle(`${question}...`)
			.setDescription(__("You win! Nice job, master of Google! You scored {0} points.", score));

		let i = 0;
		suggestions.forEach(s => {
			resultEmbed.addField(`❯ ${10000 - (i * 1000)}`, s, true);
			i++;
		});

		if (display.includes(this.hiddenCharacter))
			resultEmbed.setDescription(`Better luck next time! You scored ${score} points.`);

		return msg.channel.send(resultEmbed);
	}
	
	async fetchSuggestions(question) {
		const { text } = await request
			.get('https://suggestqueries.google.com/complete/search')
			.query({ client: 'firefox', q: question });

		const suggestions = JSON.parse(text)[1].filter(suggestion => suggestion.toLowerCase() !== question.toLowerCase());

		if (!suggestions.length) return null;
		return suggestions.map(suggestion => suggestion.toLowerCase().replace(question.toLowerCase(), '').trim());
	}
};