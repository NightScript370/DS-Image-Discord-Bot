import Command from 'discord-akairo';

export default class UnhexCommand extends Command {
	constructor() {
		super('unhex', {
			category: 'Text Fun',
			aliases: ["unhex"],
			description: {
				content: 'Converts text from hexadecimal to normal text.',
				usage: '<text to translate back from Hexadecimal Values>',
				examples: ['hello world']
			},
			args: [
				{
					id: 'text',
					type: 'text-fun',
					match: 'content'
				}
			]
		});
	}

	exec(message, { text }) {
		if (!text)
			return message.util.reply(global.translate(message.author.lang, "There were no text I can find to convert back from hexadecimal."));

		let embed;
		if (message.guild)
			embed = this.client.util.embed().setFooter(global.translate(message.author.lang, 'This command was ran by {0}', message.member.displayName));

		return message.util.send(Buffer.from(text, "hex").toString(), (embed && message.channel.embedable ? {embed} : {}));
	}
};