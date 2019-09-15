const { Command } = require('discord-akairo');
const data = require("../../assets/morse.js");

module.exports = class MorseCommand extends Command {
	constructor() {
		super('morse', {
			category: 'Text Edits',
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
		const morse	 = what => data[what] || what;
		const demorse = what => this.swap(data)[what] || what;

		let morseArr = toMorse.match(/([.\-\x{2007}]*\s*)/gmi)
		let isMorse = morseArr.length && morseArr[0].length;

		if (!isMorse)
			message.util.send(toMorse.toLowerCase().split("").map(morse).join(" "));
		else
			message.util.send(toMorse.split(" ").map(demorse).join("").toUpperCase());
	}

	swap(o) {
		var ret = {};
		for(var key in o){
			ret[o[key]] = key;
		}
		return ret;
	}
};