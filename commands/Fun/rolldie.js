import Command from 'discord-akairo';
import { random } from "including-range-array";

export default class RollDieCommand extends Command {
	constructor() {
		super('rolldie', {
			aliases: ['rolldie'],
			category: 'Fun',
			description: {
				content: 'Rolls a die'
			},
		});
	}

	exec(msg) {
		let fellon = random(6, 1)
		msg.util.reply(`Cool, you landed on a ${fellon}!`);
	}
};