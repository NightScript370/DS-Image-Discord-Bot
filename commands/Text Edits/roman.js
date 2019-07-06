const { Command } = require('discord-akairo');
const numerals = require('../../assets/JSON/roman');

module.exports = class RomanCommand extends Command {
	constructor() {
		super('roman', {
			aliases: ['roman-numeral', 'roman'],
			category: 'Text Edits',
			description: {
				content: 'Converts a number to roman numerals.',
				usage: '<number you want to convert>'
			},
			args: [
				{
					id: 'number',
					prompt: {
						start: 'What would you like to translate to a roman numeral?',
						retry: 'That\'s not something we can translate! Try again.'
					},
					type: 'integer',
					min: 1,
					max: 4999
				}
			]
		});
	}

	exec(msg, { number }) {
		if (number === 0) return msg.reply('_nulla_');
		let result = '';
		for (const [numeral, value] of Object.entries(numerals)) {
			while (number >= value) {
				result += numeral;
				number -= value;
			}
		}
		return msg.reply(result);
	}
};