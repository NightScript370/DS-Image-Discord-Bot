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
    
    this.playing = new Set();
    this.hiddenCharacter = "???";
	}

	async exec(msg) {
    const client = await this.client;

    if (this.playing.has(msg.channel.id)) return msg.reply('Only one fight may be occurring per channel.');
		this.playing.add(msg.channel.id);

    try {
      let question = questions[Math.floor(Math.random() * questions.length)];

      const suggestions = await this.fetchSuggestions(question);
			if (!suggestions) return msg.say('Could not find any results.');

      const display = new Array(suggestions.length).fill(this.hiddenCharacter);
			let tries = 3;
			while (display.includes(this.hiddenCharacter) && tries) {
				const embed = this.client.util.embed()
					.setColor(0x005AF0)
					.setTitle(`${question}...`)
					.setDescription('Type the choice you think is a suggestion _without_ the question.')
					.setFooter(`${tries} ${tries === 1 ? 'try' : 'tries'} remaining!`);
				for (let i = 0; i < suggestions.length; i++) embed.addField(`❯ ${10000 - (i * 1000)}`, display[i], true);
				await msg.channel.send(embed);
				const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
					max: 1,
					time: 30000
				});
				if (!msgs.size) {
					await msg.channel.send('Time is up!');
					break;
				}
				const choice = msgs.first().content.toLowerCase();
				if (suggestions.includes(choice)) display[suggestions.indexOf(choice)] = choice;
				else --tries;
			}
			this.playing.delete(msg.channel.id);
      
      let score = 0;
      for (let try_ of display) {
        if (try_ == this.hiddenCharacter) continue;
        let i = display.indexOf(try_);
        let tryScore = 10000 - (i * 1000);
        score += tryScore
      }

      let embed2 = this.client.util.embed()
				.setColor(0x005AF0)
				.setTitle(`${question}...`)
        .setDescription(`You win! Nice job, master of Google! You scored ${score} points.`);
      let i = 0;
      suggestions.forEach(s => {
        embed2.addField(`❯ ${10000 - (i * 1000)}`, s, true);
        i++;
      });
			if (!display.includes(this.hiddenCharacter)) return msg.channel.send(embed2);
      embed2
					.setDescription(`Better luck next time! You scored ${score} points.`);
			return msg.channel.send(embed2);
		} catch (err) {
      if (this.playing.has(msg.channel.id))
  			this.playing.delete(msg.channel.id);

      console.error(err);
			return msg.util.send(`Oh no, an error occurred: \`${err.message}\`. Please report this to the Yamamura developers!`);
		}
	}
  
  async fetchSuggestions(question) {
		const { text } = await request
			.get('https://suggestqueries.google.com/complete/search')
			.query({
				client: 'firefox',
				q: question
			});
		const suggestions = JSON.parse(text)[1]
			.filter(suggestion => suggestion.toLowerCase() !== question.toLowerCase());
		if (!suggestions.length) return null;
		return suggestions.map(suggestion => suggestion.toLowerCase().replace(question.toLowerCase(), '').trim());
	}
};