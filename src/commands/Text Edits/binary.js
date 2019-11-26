import { Command } from 'discord-akairo';

export default class BinaryCommand extends Command {
	constructor() {
		super('binary', {
			category: 'Text Fun',
			aliases: ["binary", 'binary-code'],
			description: {
				content: 'Translates your text into Binary',
				usage: '<text you\'d like to translate to binary>'
			},
			args: [{
				id: 'toBinary',
				type: 'text-fun',
				match: 'content'
			}]
		});
	}

	exec(message, { toBinary }) {
		if (!toBinary)
			return message.util.send(global.translate(message.author.lang, "There were no text to convert to Binary"));

		let embed;
		if (message.guild)
			embed = this.client.util.embed().setFooter(global.translate(message.author.lang, 'This command was ran by {0}', message.member.displayName));

		message.util.send(this.binary(toBinary), (embed && message.channel.embedable ? {embed} : {}));
	}

	binary(text) {
		return text.split('').map(str => {
			const converted = str.charCodeAt(0).toString(2);
			return `${'00000000'.slice(converted.length)}${converted}`;
		}).join('');
	}
};