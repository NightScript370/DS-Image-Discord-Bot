import { Command } from 'discord-akairo';

export default class OwoCommand extends Command {
	constructor() {
		super('owoify', {
			category: 'Text Fun',
			aliases: ["owoifi", 'owoify', 'owo-ify'],
			description: {
				content: 'Owoify what you say.',
				usage: '<text you\'d like to Owoify>'
			},
			args: [{
				id: 'toOwo',
				type: 'text-fun',
				match: 'content'
			}]
		});
	}

	exec(message, { toOwo }) {
		let embed;
		if (message.guild)
			embed = this.client.util.embed().setFooter(global.translate(message.author.lang, 'This command was ran by {0}', message.member.displayName));

		message.channel.send(this.OwOify(toOwo), (embed && message.channel.embedable ? {embed} : {}));
	}

	OwOify(text) {
		return text
			.replaceAll('speak', 'spweak')
			.replaceAll('need', 'nweed')
			.replaceAll('stand', 'stwand')
			.replaceAll(/[rl]/gm, "w")
			.replaceAll(/[RL]/gm, "W")
			.replaceAll(/ove/g, 'uv')
			.trim();
	}
};