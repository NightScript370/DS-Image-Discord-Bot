import Command from 'discord-akairo';
import data from "../../assets/morse";

export default class MorseCommand extends Command {
	constructor() {
		super('morse', {
			category: 'Text Fun',
			aliases: ["morse"],
			description: {
				content: 'Translates to Morse what you say.',
				usage: '<text to translate to Morse code>',
				examples: ['hello world', '.... . .-.. .-.. --- ....... .-- --- .-. .-.. -..']
			},
			args: [{
				id: 'morse',
				type: 'text-fun',
				match: 'content'
			}]
		});
	}

	exec(message, { morse: toMorse }) {
		let text;
		const morse	= what => data[what] || what;
		const demorse = what => this.swap(data)[what] || what;

		let morseArr = toMorse.match(/([.\-\x{2007}]*\s*)/gmi)
		let isMorse = morseArr.length && morseArr[0].length;

		if (!isMorse)
			text = toMorse.toLowerCase().split("").map(morse).join(" ");
		else
			text = toMorse.split(" ").map(demorse).join("").toUpperCase();

		let embed;
		if (message.guild)
			embed = this.client.util.embed().setFooter(global.translate(message.author.lang, 'This command was ran by {0}', message.member.displayName));

		message.util.send(text, (embed && message.channel.embedable ? {embed} : {}));
	}

	swap(o) {
		var ret = {};
		for(var key in o){
			ret[o[key]] = key;
		}
		return ret;
	}
};