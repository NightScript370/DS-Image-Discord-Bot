const { Command } = require('discord-akairo')
import numerals from '../../../assets/JSON/roman.json';
const javierInteger = require('../../utils/types.js')

module.exports = class RomanCommand extends Command {
	constructor() {
		super('roman', {
			aliases: ['roman-numeral', 'roman'],
			category: 'Text Fun',
			description: {
				content: 'Converts a number to roman numerals.',
				usage: '<number you want to convert. Must be more than 0 and less than 5000>'
			},
			args: [
				{
					id: 'number',
					type: (message, number) => {
						if (!number)
							return null;

						const returnvalue = javierInteger(message, number);
						if (isNaN(returnvalue)) return null;
						if (returnvalue == null) return null;

						if (returnvalue < 1) return null;
						if (returnvalue > 4999) return null;

						return returnvalue;
					},
					prompt: {
						start: 'What would you like to translate to a roman numeral?',
						retry: 'That\'s not something we can translate! Try again.'
					}
				}
			]
		});
	}

	exec(message, { number }) {
		let result = '';
		for (const [numeral, value] of Object.entries(numerals)) {
			while (number >= value) {
				result += numeral;
				number -= value;
			}
		}

		let embed;
		if (message.guild)
			embed = this.client.util.embed().setFooter(global.translate(message.author.lang, 'This command was ran by {0}', message.member.displayName));

		return message.util.reply(result, (embed && message.channel.embedable ? {embed} : {}));
	}
};