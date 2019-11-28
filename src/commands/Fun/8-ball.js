import discordAkairo from 'discord-akairo';
import answers from '../../../assets/JSON/8-ball.json';

export default class Number8ballCommand extends discordAkairo.Command {
	constructor() {
		super('8-ball', {
			aliases: ['8-ball', "8ball"],
			category: 'Fun',
			description: {
				content: 'Ask your question to the magical 8 ball.',
				usage: '<question>',
				examples: 'Should I play Super Mario Bros today?'
			},
			args: [
				{
					id: 'question',
					type: 'text-fun',
					match: 'content'
				}
			],
		});
	}

	async exec(message, { question }) {
		let embed;

		if (message.guild)
			embed = this.client.util.embed()
				.addField('Original Question', question.length > 1000 ? question.substr(0, 100) + '...' : question)
				.setFooter(global.translate(message.author.lang, 'I was summoned here by {0}', message.member.displayName), `${this.client.website.URL}/icons/8-ball.png`);

		message.util.send(`🎱 **|** ${answers.random()}`,  (embed && message.channel.embedable ? {embed} : {}));
	}
};